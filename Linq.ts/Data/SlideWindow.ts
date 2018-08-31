namespace data {

    export class SlideWindow<T> extends IEnumerator<T> {

        /**
         * 这个滑窗对象在原始的数据序列之中的最左端的位置
        */
        public index: number;

        public constructor(index: number, src: T[] | IEnumerator<T>) {
            super(src);
            this.index = index;
        }
    }
}