export const myMixin =  {
    data(){
        return {

        }
    },
    created: function(){

    },
    methods: {
        formatDateTime2(dateObj){
            // ISOString '2012-11-04T14:51:06.157Z'
            return new Date(dateObj).toISOString()
            .replace(/T/, ' ')      // replace T with a space
            .replace(/\..+/, '')     // delete the dot and everything after
            .slice(0,-3)  // remove seconds
            // output '2012-11-04 14:55:45'

        },
        formatDateTime(dateObj){
            // ISOString '2012-11-04T14:51:06.157Z'
            const strDate = new Date(dateObj).toISOString().slice(0,10)
            var hours = dateObj.getHours();
            var minutes = dateObj.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm;
            return strDate + ' ' + strTime
            // output '2012-11-04 2:55 PM'

        },

        formatTime(dateObj){
            var hours = dateObj.getHours();
            var minutes = dateObj.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            return hours + ':' + minutes + ' ' + ampm;
        },
        formatDate(dateObj){
            // ISOString '2012-11-04T14:51:06.157Z'
            return new Date(dateObj).toISOString()
            .slice(0,10)  
            // output '2012-11-04'

        },

        formatWeekDay(dateObj){
            const weekday = ["日","一","二","三","四","五","六"];
            return weekday[dateObj.getDay()];
        },
        identifyBrowser() {
            var sBrowser, sUsrAg = navigator.userAgent;
            
            if (sUsrAg.indexOf("Firefox") > -1) {   // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
                sBrowser = "Mozilla Firefox";   
            } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {     // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
                sBrowser = "Samsung Internet";
            } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {         // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
                sBrowser = "Opera";
            } else if (sUsrAg.indexOf("Trident") > -1) {            // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
                sBrowser = "Microsoft Internet Explorer";
            } else if (sUsrAg.indexOf("Edge") > -1) {               // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
                sBrowser = "Microsoft Edge";
            } else if (sUsrAg.indexOf("Chrome") > -1) {             // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
                sBrowser = "Google Chrome or Chromium";
            } else if (sUsrAg.indexOf("Safari") > -1) {             // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
                sBrowser = "Apple Safari";
            } else {
                sBrowser = "unknown";
            }
            
            return sBrowser;
        },
        copyToClipboard(text) {
            
            /* write to the clipboard now */
            navigator.clipboard.writeText(text).then(function () {
                alert("Copied to clipboard!");
            })
            .catch(function (error) {
                alert(error);
            });
                    
        }
  
    }
  };