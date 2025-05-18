/**
 * Forum link: https://forum.vivaldi.net/topic/92477/some-javascript-to-automatically-hide-tab-bar-and-address-bar-and-show-them-by-hovering
 * Hides the tab bar and address bar when not hovering
 */
(function checkWebViewForFullscreen() {
    const webView = document.querySelector('#webview-container'),
        hidePanels = true, // set to false to not hide the panels
        bookmarkBarPadding = '6px', // set to '0px' to remove the padding around the bookmark bar
        showDelay = 125, // set to 0 to remove the delay
        hideDelay = 250, // set to 0 to remove the delay
        showAddressBarOnFocus = true, // shows the address bar on a new tab or if in focus - set to false to disable the feature
        showAddressBarPadding = 15, // moves the address bar on a new tab or if in focus to - positive and negative values are allowed
        updateHoverDivSize = true; // decreases the size for the hover divs in fullscreen mode - set ti false to disable the feature

    if (!webView) {
        setTimeout(checkWebViewForFullscreen, 1337);
        return;
    }

    const positions = ['top', 'bottom', 'left', 'right'],
        app = document.querySelector('#app'),
        browser = document.querySelector('#browser'),
        header = document.querySelector('#header'),
        mainBar = document.querySelector('.mainbar'),
        bookmarkBar = document.querySelector('.bookmark-bar'),
        panelsContainer = document.querySelector('#panels-container'),
        tabBarClassList = document.querySelector('#tabs-tabbar-container').classList,
        panelsLeft = document.querySelector('#panels-container').classList.contains('left'),
        tabBarPosition = positions.find(cls => tabBarClassList.contains(cls)),
        addressBarTop = browser.classList.contains('address-top'),
        bookmarksTop = browser.classList.contains('bookmark-bar-top');

    let fullscreenEnabled,
        showTopTimeout,
        showLeftTimeout,
        showRightTimeout,
        showBottomTimeout,
        hideTimeout;

    chrome.storage.local.get('fullScreenModEnabled').then((value) => {
        fullscreenEnabled = value.fullScreenModEnabled || value.fullScreenModEnabled == undefined;
        if (fullscreenEnabled) {
            addFullScreenListener();
        }
    });

    vivaldi.tabsPrivate.onKeyboardShortcut.addListener((id, combination) => combination === 'F11' && toggleFullScreen());

    let style = `
        .fullscreen-listener-enabled {
            ${generalCSS()}
            ${topCSS()}
            ${leftCSS()}
            ${rightCSS()}
            ${bottomCSS()}
        }

        #app:not(.fullscreen-listener-enabled) .hover-div {
            visibility: hidden;
        }
    `;

    if (bookmarkBarPadding) {
        style += `
            .fullscreen-listener-enabled .bookmark-bar {
                height: auto;
                padding-top: ${bookmarkBarPadding};
                padding-bottom: calc(${bookmarkBarPadding} / 2);
            }
        `;
    }

    const styleEl = document.createElement('style');
    styleEl.appendChild(document.createTextNode(style));

    document.head.appendChild(styleEl);

    const hoverDivTop = createHorizontalHoverDiv('top'),
        hoverDivLeft = (hidePanels && panelsLeft) || tabBarPosition === 'left' ? createVerticalHoverDiv('left') : undefined,
        hoverDivRight = (hidePanels && !panelsLeft) || tabBarPosition === 'right' ? createVerticalHoverDiv('right') : undefined,
        hoverDivBottom = !addressBarTop || tabBarPosition === 'bottom' || !bookmarksTop || document.querySelector('#footer').childNodes.length ? createHorizontalHoverDiv('bottom') : undefined;

    function toggleFullScreen() {
        fullscreenEnabled = !fullscreenEnabled;
        fullscreenEnabled ? addFullScreenListener() : removeFullScreenListener();
        chrome.storage.local.set({fullScreenModEnabled: fullscreenEnabled});
    }

    function addFullScreenListener() {
        app.classList.add('fullscreen-listener-enabled');
        webView.addEventListener('pointerenter', hide);

        if (hideDelay) {
            webView.addEventListener('pointerleave', clearHideTimeout);
        }

        hoverDivTop.addEventListener('pointerenter', showTop);
        hoverDivTop.addEventListener('pointerleave', clearTimeouts);

        if (hoverDivLeft) {
            hoverDivLeft.addEventListener('pointerenter', showLeft);
            hoverDivLeft.addEventListener('pointerleave', clearTimeouts);
        }

        if (hoverDivRight) {
            hoverDivRight.addEventListener('pointerenter', showRight);
            hoverDivRight.addEventListener('pointerleave', clearTimeouts);
        }

        if (hoverDivBottom) {
            hoverDivBottom.addEventListener('pointerenter', showBottom);
            hoverDivBottom.addEventListener('pointerleave', clearTimeouts);
        }

        if (updateHoverDivSize) addEventListener('resize', updateHoverDivs);

        hide();
    }

    function removeFullScreenListener() {
        app.classList.remove('fullscreen-listener-enabled');
        webView.removeEventListener('pointerenter', hide);

        if (hideDelay) {
            webView.removeEventListener('pointerleave', clearHideTimeout);
        }

        hoverDivTop.removeEventListener('pointerenter', showTop);
        hoverDivTop.removeEventListener('pointerleave', clearTimeouts);

        if (hoverDivLeft) {
            hoverDivLeft.removeEventListener('pointerenter', showLeft);
            hoverDivLeft.removeEventListener('pointerleave', clearTimeouts);
        }

        if (hoverDivRight) {
            hoverDivRight.removeEventListener('pointerenter', showRight);
            hoverDivRight.removeEventListener('pointerleave', clearTimeouts);
        }

        if (hoverDivBottom) {
            hoverDivBottom.removeEventListener('pointerenter', showBottom);
            hoverDivBottom.removeEventListener('pointerleave', clearTimeouts);
        }

        if (updateHoverDivSize) removeEventListener('resize', updateHoverDivs);

        show();
    }

    function clearTimeouts() {
        if (showTopTimeout) clearTimeout(showTopTimeout);
        if (showLeftTimeout) clearTimeout(showLeftTimeout);
        if (showRightTimeout) clearTimeout(showRightTimeout);
        if (showBottomTimeout) clearTimeout(showBottomTimeout);
    }

    function clearHideTimeout() {
        if (hideTimeout) clearTimeout(hideTimeout);
    }

    function hide() {
        hideTimeout = setTimeout(() => {
            app.classList.add('hidden-top');
            if (hoverDivLeft) app.classList.add('hidden-left');
            if (hoverDivRight) app.classList.add('hidden-right');
            if (hoverDivBottom) app.classList.add('hidden-bottom');
        }, hideDelay);
    }

    function show() {
        showTop();
        showLeft();
        showRight();
        showBottom();
    }

    function showTop() {
        showTopTimeout = setTimeout(() => app.classList.remove('hidden-top'), showDelay);
    }

    function showLeft() {
        if (hoverDivLeft) {
            showLeftTimeout = setTimeout(() => app.classList.remove('hidden-left'), showDelay);
        }
    }

    function showRight() {
        if (hoverDivRight) {
            showRightTimeout = setTimeout(() => app.classList.remove('hidden-right'), showDelay);
        }
    }

    function showBottom() {
        if (hoverDivBottom) {
            showBottomTimeout = setTimeout(() => app.classList.remove('hidden-bottom'), showDelay);
        }
    }

    function isWindowMaximized() {
        return browser.classList.contains('maximized');
    }

    function setHorizontalHoverDivHeight(hoverDiv) {
        hoverDiv.style.height = updateHoverDivSize && isWindowMaximized() ? '1px' : '1.5rem';
    }

    function setVerticalHoverDivWidth(hoverDiv) {
        hoverDiv.style.width = updateHoverDivSize && isWindowMaximized() ? '1px' : '1.5rem'
    }

    function updateHoverDivs() {
        setTimeout(() => {
            setHorizontalHoverDivHeight(hoverDivTop);
            if (hoverDivLeft) setVerticalHoverDivWidth(hoverDivLeft);
            if (hoverDivRight) setVerticalHoverDivWidth(hoverDivRight);
            if (hoverDivBottom) setHorizontalHoverDivHeight(hoverDivBottom);
        }, 150);
    }

    function createHorizontalHoverDiv(position) {
        const hoverDiv = document.createElement('div');
        setHorizontalHoverDivHeight(hoverDiv);
        hoverDiv.style.width = '100vw';
        hoverDiv.style.position = 'fixed';
        hoverDiv.style.left = '0';
        hoverDiv.style.zIndex = '10';
        hoverDiv.style[position] = '0';
        hoverDiv.className = 'hover-div';
        hoverDiv.classList.add(position);
        document.querySelector('#app').appendChild(hoverDiv);
        return hoverDiv;
    }

    function createVerticalHoverDiv(position) {
        const hoverDiv = document.createElement('div');
        hoverDiv.style.height = '100%';
        setVerticalHoverDivWidth(hoverDiv);
        hoverDiv.style.position = 'fixed';
        hoverDiv.style.top = '0';
        hoverDiv.style.zIndex = '10';
        hoverDiv.style[position] = '0';
        hoverDiv.className = 'hover-div';
        hoverDiv.classList.add(position);
        document.querySelector('#app').appendChild(hoverDiv);
        return hoverDiv;
    }

    function generalCSS() {
        return `
            #header, .mainbar, .bookmark-bar, #panels-container {
                transition: transform .5s, opacity .5s ease-in-out !important;
            }

            #header, .mainbar {
                z-index: 8;
            }

            .bookmark-bar  {
                position: absolute;
                left: 0;
                right: 0;
                z-index: 7;
            }

            #header .vivaldi {
                margin-top: 3px;
            }

            #main {
                padding-top: 0 !important;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;

                .inner {
                    position: unset;

                    #webview-container {
                        position: fixed !important;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                }
            }

            #panels-container {
                position: absolute !important;
            }

            .extensionIconPopupMenu, .button-popup {
                z-index: 8;
            }

            footer {
                margin-top: auto !important;
            }

            .hover-div {
                transition: visibility 0.5s ease-in-out;
            }
        `;
    }

    function topCSS() {
        const topElements = [];
        let height = 0;

        if (tabBarPosition === 'top' || !addressBarTop) {
            topElements.push('#header');
            height += getHeight(header);
        }

        if (addressBarTop) {
            topElements.push('.mainbar');
            height += getHeight(mainBar);
        }

        if (bookmarksTop && bookmarkBar) {
            topElements.push('.bookmark-bar');
            height += getHeight(bookmarkBar);
        }

        if (topElements.length === 0) {
            return '';
        }

        let css = `
            &.hidden-top {
                ${topElements.join(', ')} {
                    transform: translateY(-${height}px);
                    opacity: 0;
                }
            }

            &:not(.hidden-top) .hover-div.top {
                visibility: hidden;
            }
        `;

        if (showAddressBarOnFocus && addressBarTop) {
            css += `
                &.hidden-top {
                    #browser:has(.internal-page .startpage .SpeedDialView), #browser:has(.internal-page .startpage .Dashboard), #browser:has(.UrlBar-AddressField:focus-within) {
                        .mainbar {
                            opacity: 1;

                            .UrlBar-AddressField {
                                position: absolute;
                                top: ${height + showAddressBarPadding}px;
                                left: 25vw;
                                right: 25vw;
                                width: 50vw !important;
                            }
                        }
                    }
                }
            `;
        }

        if (addressBarTop) {
            if (bookmarksTop) {
                css += `
                    .bookmark-bar-top-off .mainbar {
                        padding-bottom: 5px;
                        background: var(--colorAccentBg);
                    }
                `;
            }

            if (tabBarPosition === 'top') {
                css += `
                    .mainbar {
                        margin-top: ${getHeight(header)}px;
                    }
                `;
            }
        }

        if (bookmarksTop) {
            css += `
                .bookmark-bar {
                    top: 0;
                    margin-top: ${height - getHeight(bookmarkBar)}px;
                }
            `;
        }

        return css;
    }

    function leftCSS() {
        const leftElements = [];
        let width = 0,
            tabbarWrapper;

        if (tabBarPosition === 'left') {
            leftElements.push('.tabbar-wrapper');
            tabbarWrapper = document.querySelector('.tabbar-wrapper');
            width += tabbarWrapper.offsetWidth;
        }

        if (hidePanels && panelsLeft) {
            leftElements.push('#panels-container');
            width += panelsContainer.offsetWidth;
        }

        if (leftElements.length === 0) {
            return '';
        }

        let css = `
            &.hidden-left {
                ${leftElements.join(', ')} {
                    transform: translateX(-${width}px);
                    opacity: 0;
                }
            }

            &:not(.hidden-left) .hover-div.left {
                visibility: hidden;
            }
        `;

        if (tabBarPosition === 'left') {
            css += `
                .tabbar-wrapper {
                    position: absolute;
                    top: 0;
                    left: ${panelsLeft ? panelsContainer.offsetWidth : 0}px;
                    z-index: 1;
                    transition: transform .5s, opacity .5s ease-in-out !important;

                    &  > .tabbar-wrapper {
                        position: static;
                    }
                }
            `;
        }

        return css;
    }

    function rightCSS() {
        const rightElements = [];
        let width = 0,
            tabbarWrapper;

        if (tabBarPosition === 'right') {
            rightElements.push('.tabbar-wrapper');
            tabbarWrapper = document.querySelector('.tabbar-wrapper');
            width += tabbarWrapper.offsetWidth;
        }

        if (hidePanels && !panelsLeft) {
            rightElements.push('#panels-container');
            width += panelsContainer.offsetWidth;
        }

        if (rightElements.length === 0) {
            return '';
        }

        let css = `
            &.hidden-right {
                ${rightElements.join(', ')} {
                    transform: translateX(${width}px);
                    opacity: 0;
                }
            }

            &:not(.hidden-right) .hover-div.right {
                visibility: hidden;
            }
        `;

        if (tabBarPosition === 'right') {
            css += `
                .tabbar-wrapper {
                    position: absolute;
                    top: 0;
                    right: ${!panelsLeft ? panelsContainer.offsetWidth : 0}px;
                    z-index: 1;
                    transition: transform .5s, opacity .5s ease-in-out !important;

                    &  > .tabbar-wrapper {
                        position: static;
                    }
                }
            `;
        }

        return css;
    }

    function bottomCSS() {
        const bottomElements = [],
            footer = document.querySelector('#footer');
        let height = 0;

        if (footer.childNodes.length) {
            bottomElements.push('#footer');
            height += getHeight(footer);
        }

        if (!addressBarTop) {
            bottomElements.push('.mainbar');
            height += getHeight(mainBar);
        }

        if (!bookmarksTop && bookmarkBar) {
            bottomElements.push('.bookmark-bar');
            height += getHeight(bookmarkBar);
        }

        if (bottomElements.length === 0) {
            return '';
        }

        let css = `
            &.hidden-bottom {
                ${bottomElements.join(', ')} {
                    transform: translateY(${height}px);
                    opacity: 0;
                }
            }

            &:not(.hidden-bottom) .hover-div.bottom {
                visibility: hidden;
            }
        `;

        if (showAddressBarOnFocus && !addressBarTop) {
            css += `
                &.hidden-bottom {
                    #browser:has(.internal-page .startpage), #browser:has(.UrlBar-AddressField:focus-within) {
                        .mainbar {
                            opacity: 1;

                            .UrlBar-AddressField {
                                position: absolute;
                                bottom: ${getHeight(mainBar) + 10 + showAddressBarPadding}px;
                                left: 25vw;
                                right: 25vw;
                                width: 50vw !important;
                            }
                        }
                    }
                }
            `;
        }

        if (tabBarPosition === 'bottom') {
            css += `
                #footer {
                    transition: transform .5s, opacity .5s ease-in-out !important;
                }
            `;
        }

        if (!addressBarTop) {
            css += `
                .mainbar {
                    margin-bottom: ${getHeight(footer)}px;
                }
            `;

            if (!bookmarksTop) {
                css += `
                    .bookmark-bar-bottom-off .mainbar {
                        padding-bottom: -5px;
                        background: var(--colorAccentBg);
                    }
                `;
            }
        }

        if (!bookmarksTop) {
            css += `
                .bookmark-bar {
                    bottom: ${getHeight(footer) + (!addressBarTop ? getHeight(mainBar) : 0)}px;
                    margin-bottom: 0;
                }
            `;
        }

        return css;
    }

    function getHeight(el) {
        return el?.offsetHeight || 0;
    }
})();

