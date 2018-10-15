namespace Linq.TsQuery {

    export class Arguments {

        //#region "meta tag value query"
        public caseInSensitive: boolean;
        /**
         * 进行meta节点查询失败时候所返回来的默认值
        */
        public defaultValue: string;
        //#endregion

        //#region "node query && create"

        /**
         * 对于节点查询和创建，是否采用原生的节点返回值？默认是返回原生的节点，否则会返回``HTMLTsElement``对象
         * 
         * + 假若采用原生的节点返回值，则会在该节点对象的prototype之中添加拓展函数
         * + 假若采用``HTMLTsElement``模型，则会返回一个经过包裹的``HTMLElement``节点对象
        */
        public nativeModel: boolean;

        //#endregion

        public static Default(): Arguments {
            return <Arguments>{
                caseInSensitive: false,
                nativeModel: true
            }
        }
    }
}