/// <reference path="../Collections/Abstract/Enumerator.ts" />

namespace TypeScript.Data {

    export class PriorityQueue<T> extends IEnumerator<QueueItem<T>> {

        /**
         * 队列元素
        */
        public get Q(): QueueItem<T>[] {
            return this.sequence;
        }

        public constructor() {
            super([]);
        }

        /**
         *
        */
        public enqueue(obj: T) {
            let last = this.Last;
            let q = this.Q;
            let x = new QueueItem(obj);

            q.push(x);

            if (last) {
                last.below = x;
                x.above = last;
            }
        }

        public extract(i: number): QueueItem<T> {
            let q = this.Q;
            let x_above = q[i - 1];
            let x_below = q[i + 1];
            let x = q.splice(i, 1)[0];

            if (x_above) {
                x_above.below = x_below;
            }
            if (x_below) {
                x_below.above = x_above;
            }

            return x;
        }

        public dequeue(): QueueItem<T> {
            return this.extract(0);
        }
    }

    export class QueueItem<T> {

        public below: QueueItem<T>;
        public above: QueueItem<T>;

        public constructor(public value: T) { }

        public toString(): string {
            return this.value.toString();
        }
    }
}