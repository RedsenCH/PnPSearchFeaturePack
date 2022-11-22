export default class LoggerService {
  public static logError(title: string = "DEBUG", ...data: any[]) {
    console.log(`%c${title}`, "color: red");
    LoggerService.log(title, ...data);
  }

  public static log(title: string = "DEBUG", ...data: any[]) {
    // const params = new URLSearchParams(document.location.search.substring(1));
    if (LoggerService.isDebugMode()) {
      console.groupCollapsed(title);
      console.log(...data);
      console.trace(); // hidden in collapsed group
      console.groupEnd();
    }
  }

  private static isDebugMode(): boolean {
    let isDebug: boolean = false;

    const params = new URLSearchParams(document.location.search.substring(1));
    if (params.get("debugManifestsFile")) {
      isDebug = true;
      return isDebug;
    }

    return false;
  }
}
