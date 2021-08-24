namespace TypeScript.Data {

    export function group(x: number[], offset: number) {
        const groups: Group<number, number>[] = [];

        for (let d of x) {
            let hit: boolean = false;

            for (let n of groups) {
                if (Math.abs(n.Key - d) <= offset) {
                    hit = true;
                    n.Group.push(d);

                    break;
                }
            }

            if (!hit) {
                groups.push(new Group(d, [d]));
            }
        }

        return groups;
    }
}