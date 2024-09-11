namespace DOM.Animation {

    export function scrollTo(id: string) {
        let hash: string = null;

        if (id.substring(0, 1) == "#") {
            // #id
            hash = id;
            id = id.substring(1);
        } else {
            hash = "#" + id;
        }

        window.location.hash = hash;
        window.addEventListener("hashchange", () => {
            if (window.location.hash === hash) {
                setTimeout(() => moveTo(hash), 0);
            }
        });
    }

    function moveTo(hash: string) {
        // 获取目标anchor元素的位置
        let anchor = $ts(hash);
        let anchorRect = anchor.getBoundingClientRect();

        // 获取视口宽度和高度
        let viewportWidth = window.innerWidth;
        let viewportHeight = window.innerHeight;

        // 获取当前滚动条的位置
        let scrollPositionX = window.scrollX;
        let scrollPositionY = window.scrollY;

        // 计算目标位置到视口中心的偏移量
        let offsetX = anchorRect.left - (viewportWidth / 2) + (anchorRect.width / 2);
        let offsetY = anchorRect.top - (viewportHeight / 2) + (anchorRect.height / 2);

        // 滚动页面，使目标位置居中
        window.scrollTo({
            left: scrollPositionX + offsetX,
            top: scrollPositionY + offsetY,
            behavior: 'smooth' // 可选，用于平滑滚动
        });
    }
}