class TypeInfo {

    public TypeOf: string;

    /**
     * 如果这个属性是空的，则说明是js之中的基础类型
    */
    public Class: string;

    /**
     * 是否是js之中的基础类型？
    */
    public get IsPrimitive(): boolean {
        return !this.Class;
    }

    /**
     * 获取某一个对象的类型信息
    */
    public static typeof<T>(obj: T): TypeInfo {
        return <TypeInfo>{
            TypeOf: typeof obj,
            Class: (typeof obj == "object") ? obj.constructor.toString() : ""
        };
    }

    public toString() {
        if (this.TypeOf == "object") {
            return `<${this.TypeOf}> ${this.Class}`;
        } else {
            return this.TypeOf;
        }
    }
}