namespace Levenshtein {

    export interface IScoreFunc {
        insert(c: string | number): number;
        delete(c: string | number): number;
        substitute(s: string | number, t: string | number): number;
    }

    const defaultScore: IScoreFunc = {
        insert: x => 1,
        delete: x => 1,
        substitute: function (s, t) {
            if (s == t) {
                return 0;
            } else {
                return 1;
            }
        }
    }

    export function DistanceMatrix(source: string, target: string, score: IScoreFunc = defaultScore): number[][] {
        let src: number[] = <number[]>Strings.ToCharArray(source, true);
        let tar: number[] = <number[]>Strings.ToCharArray(target, true);

        if (src.length == 0 && tar.length == 0) {
            return [[0]];
        }
        if (src.length == 0) {
            return [[$ts(tar).Sum(c => score.insert(c))]];
        } else if (tar.length == 0) {
            return [[$ts(src).Sum(c => score.delete(c))]];
        }

        let ns = src.length + 1;
        let nt = tar.length + 1;

        let d = 
    }
}