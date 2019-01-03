namespace TsLinq {

    /**
     * �����������Զ��Ľ������ߵĺ���������Ϊ�������ж�Ӧ�ļ�ֵ�Ķ�ȡ����
    */
    export class MetaReader {

        /**
         * �ֵ����
         * 
         * > �����ﲻʹ��Dictionary��������Ϊ�ö���Ϊһ��ǿ����Լ������
        */
        private readonly meta: object;

        public constructor(meta: object) {
            this.meta = meta;
        }

        /**
         * Read meta object value by call name
         * 
         * > https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
        */
        public GetValue(key: string = null): any {
            if (!key) {
                key = StackTrace.GetCallerMember().memberName;
            }

            if (key in this.meta) {
                return this.meta[key];
            } else {
                return null;
            }
        }
    }
}