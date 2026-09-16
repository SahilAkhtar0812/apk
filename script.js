(() => {

    'use strict';

    /* =========================================
       CONFIG
    ========================================= */

    const CONFIG = Object.freeze({

        pixelId: '1690460386418688',

        apkUrl: 'https://jdmatka.tech/jdmatka.apk',

        minimumClickTimeMs: 500,

        redirectDelayMs: 500

    });


    const pageOpenedAt = Date.now();

    let downloadTracked = false;

    let navigationStarted = false;


    /* =========================================
       LOAD META PIXEL
    ========================================= */

    function loadMetaPixel() {

        !function(f,b,e,v,n,t,s) {

            if(f.fbq) return;

            n = f.fbq = function() {

                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);

            };

            if(!f._fbq) f._fbq = n;

            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];

            t = b.createElement(e);
            t.async = true;
            t.src = v;

            s = b.getElementsByTagName(e)[0];

            s.parentNode.insertBefore(t, s);

        }(
            window,
            document,
            'script',
            'https://connect.facebook.net/en_US/fbevents.js'
        );


        /* Initialize Pixel */

        fbq(
            'init',
            CONFIG.pixelId
        );


        /* Standard PageView */

        fbq(
            'track',
            'PageView'
        );

    }


    /* =========================================
       DOWNLOAD CLICK
    ========================================= */

    function handleDownload(event) {

        event.preventDefault();


        if(navigationStarted) {
            return;
        }


        navigationStarted = true;


        const timeOnPageMs =
            Date.now() - pageOpenedAt;


        const validClick =

            event.isTrusted &&

            navigator.webdriver !== true &&

            timeOnPageMs >=
                CONFIG.minimumClickTimeMs;


        /* =====================================
           FIRE DOWNLOAD EVENT
        ===================================== */

        if(
            validClick &&
            !downloadTracked &&
            typeof window.fbq === 'function'
        ) {

            fbq(
                'trackCustom',
                'Download',
                {
                    content_name:
                        'JD Matka Android APK',

                    content_type:
                        'application',

                    file_name:
                        'jdmatka.apk',

                    destination:
                        'APK Download',

                    source:
                        'JD Matka Website',

                    time_on_page:
                        Math.round(
                            timeOnPageMs / 1000
                        )
                }
            );


            downloadTracked = true;

        }


        /* =====================================
           DOWNLOAD APK
        ===================================== */

        window.setTimeout(
            function() {

                window.location.href =
                    CONFIG.apkUrl;

            },

            validClick
                ? CONFIG.redirectDelayMs
                : 50

        );

    }


    /* =========================================
       CONNECT DOWNLOAD BUTTONS
    ========================================= */

    function initializeDownloadButtons() {

        const buttons =
            document.querySelectorAll(
                '.download-link'
            );


        buttons.forEach(
            function(button) {

                /* Force correct APK URL */

                button.href =
                    CONFIG.apkUrl;


                button.addEventListener(
                    'click',
                    handleDownload
                );

            }
        );

    }


    /* =========================================
       START
    ========================================= */

    loadMetaPixel();


    if(
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            initializeDownloadButtons,
            {
                once: true
            }
        );

    }

    else {

        initializeDownloadButtons();

    }

})();