namespace Levenshtein {

    export interface IScoreFunc {
        insert(c: string): number;
        delete(c: string): number;
        substitute(s: string, t: string): number;
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
        let src: string[] = Strings.ToCharArray(source);
        let tar: string[] = Strings.ToCharArray(target);

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