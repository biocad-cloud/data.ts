namespace TsLinq {

    export class StackTrace extends IEnumerator<StackFrame> {

        public constructor(frames: IEnumerator<StackFrame> | StackFrame[]) {
            super(frames);
        }

        public static Dump(): StackTrace {
            var err = new Error().stack.split("\n");
            var trace = From(err)
                //   1 是第一行 err 字符串, 
                // + 1 是跳过当前的这个Dump函数的栈信息
                .Skip(1 + 1)
                .Select(StackFrame.Parse);

            return new StackTrace(trace);
        }

        public static GetCallerMember(): StackFrame {
            var trace = StackTrace.Dump().ToArray();
            // index = 1 是GetCallerMemberName这个函数的caller的栈片段
            // index = 2 就是caller的caller的栈片段，即该caller的CallerMemberName
            var caller = trace[1 + 1];

            return caller;
        }

        public toString(): string {
            var sb = new StringBuilder();

            this.ForEach(frame => {
                sb.AppendLine(`  at ${frame.toString()}`);
            });

            return sb.toString();
        }
    }
}