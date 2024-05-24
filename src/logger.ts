export class Log {

    public static VERBOSE = true;

    public static d(o: any){
        if (!this.VERBOSE) { return; }
        this.p(o, Level.DEBUG)
    }

    public static ds(o: any){
        if (!this.VERBOSE) { return; }
        var cache: any[] = [];
        var objectPrint = JSON.stringify(o, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Duplicate reference found
                    try {
                        // If this value does not reference a parent it can be deduped
                        return JSON.parse(JSON.stringify(value));
                    } catch (error) {
                        // discard key if value cannot be deduped
                        return;
                    }
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
            }, 2)
        
        cache = [];

        this.p("Static Obj Print: " + objectPrint, Level.SPECIAL)

    }

    public static dr(o: any){
        if (!this.VERBOSE) { return; }
        this.p("Dir Print:", Level.SPECIAL)
        console.dir(o)
    }

    public static e(o: any){
        this.p(o, Level.ERROR)
    }

    public static i(o: any){
        if (!this.VERBOSE) { return; }
        this.p(o, Level.INFO)
    }

    public static w(o: any){
        if (!this.VERBOSE) { return; }
        this.p(o, Level.WARN)
    }

    private static p(o : any, l: Level){
        let todaysDate = new Date();
        let timestamp = todaysDate.toLocaleTimeString()
        
        let timestamp_format= "background: white; color: gray"

        console.log("%c" + timestamp +"%c ["+l+"] " + o , timestamp_format, this.getLogFormatting(l))
    }

    private static getLogFormatting(l : Level){
        switch (l) {
            case Level.DEBUG:
                return "background: white; color: black"

            case Level.WARN:
                return "background: white; color: #f8a21a"

            case Level.INFO:
                return "background: white; color: #023b62"

            case Level.ERROR:
                return "background: white; color: #db4437"

            case Level.SPECIAL:
                return "background: white; color: #694aab"
        }
    }

    public test(){
        Log.d("This is a debug message")
        Log.i("This is a info message")
        Log.w("This is a warning message")
        Log.e("This is a error message")
    
        Log.ds({a: "AAA", b: "BBB"})
        Log.dr({a: "AAA", b: "BBB"})
    }
}

enum Level {
    DEBUG = "DEB",
    INFO = "INF",
    WARN = "WRN",
    ERROR = "ERR",
    SPECIAL = "SPL"
}