/** A full shuffled tour, with no repeated project at the boundary of two tours. */
export function createProjectShuffle(ids: readonly string[], random = Math.random) {
  const projects = [...new Set(ids)];
  let remaining: string[] = [];
  let last: string | null = null;
  return {
    next(): string | null {
      if (!projects.length) return null;
      if (!remaining.length) {
        remaining = [...projects];
        for (let index = remaining.length - 1; index > 0; index--) {
          const other = Math.floor(random() * (index + 1));
          [remaining[index], remaining[other]] = [remaining[other], remaining[index]];
        }
        if (remaining.length > 1 && remaining[0] === last) {
          const other = 1 + Math.floor(random() * (remaining.length - 1));
          [remaining[0], remaining[other]] = [remaining[other], remaining[0]];
        }
      }
      last = remaining.shift()!;
      return last;
    },
  };
}
