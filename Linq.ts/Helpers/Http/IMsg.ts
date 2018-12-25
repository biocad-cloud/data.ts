/**
 * 前端与后台之间的get/post的消息通信格式的简单接口抽象
*/
interface IMsg<T> {

    /**
     * 错误代码，一般使用零表示没有错误
    */
    code: number;
    /**
     * 消息的内容
    */
    info: T;
}