import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import * as _ from "lodash";


const DateHelper_ServiceKey = 'PnPModernSearchDateHelper';

export class DateHelper {

    public static ServiceKey: ServiceKey<DateHelper> = ServiceKey.create(DateHelper_ServiceKey, DateHelper);

    private momentLibrary: any;

    private pageContext: PageContext;

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.pageContext = serviceScope.consume<PageContext>(PageContext.serviceKey);
        });
    }

    public async moment(): Promise<any> {

        if (this.momentLibrary) {
            return Promise.resolve(this.momentLibrary);
        } else {
            const moment: any = await import(
                /* webpackChunkName: 'pnp-modern-search-moment' */
                'moment'
            );

            let culture = this.pageContext.cultureInfo.currentUICultureName.toLowerCase();

            // if culture starts with or is any of this, two letter locale must be used in momentjs (culture es-es must load es.js file)
            const momentTwoLetterLanguageName = [
                "af", "az", "be", "bg", "bm", "bo", "br", "bs", "ca", "cs", "cv",
                "cy", "da", "de-de", "dv", "el", "eo", "es-es", "et", "eu", "fa", "fi", "fil",
                "fo", "fy", "fr-fr", "ga", "gd", "gl", "gu", "he", "hi", "hr", "hu", "id", "is",
                "it-it", "ja", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "lb", "lo", "lt",
                "lv", "me", "mi", "mk", "ml", "mn", "mr", "mt", "my", "nb", "ne",
                "nn", "nl-nl", "pl", "pt-pt", "ro", "ru", "sd", "se", "si", "sk", "sl", "sq",
                "ss", "sv", "sw", "ta", "te", "tet", "tg", "th", "tk", "tlh",
                "tr", "tzl", "uk", "ur", "vi", "yo"
            ];

            // Moment is by default 'en-us'

            
            if (!_.startsWith(culture, 'en-us')) {
                // check if culture must be used with two letter name in momentjs  
                for (let i = 0; i < momentTwoLetterLanguageName.length; i++)
                    if (_.startsWith(culture, momentTwoLetterLanguageName[i])) {
                        culture = culture.split('-')[0];
                        break;
                    }


                await import(
                    /* webpackChunkName: 'pnp-modern-search-moment' */
                    `moment/locale/${culture}.js`
                );
            }

            // Needs to use 'default' due to webpack 4.
            this.momentLibrary = moment.default;

            // Set default locale
            this.momentLibrary.locale(culture);
            return this.momentLibrary;
        }
    }

    public isDST() {
        const today = new Date();
        const jan = new Date(today.getFullYear(), 0, 1);
        const jul = new Date(today.getFullYear(), 6, 1);
        const stdTimeZoneOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return today.getTimezoneOffset() < stdTimeZoneOffset;
    }

    public addMinutes(isDst: boolean, date: Date, minutes: number, dst: number) {
        if (isDst) {
            minutes += dst;
        }
        return new Date(date.getTime() + minutes * 60000);
    }
}