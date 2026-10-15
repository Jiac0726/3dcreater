export function createHistory(initial,max=50){
 let states=[JSON.stringify(initial)],cursor=0;
 return {
  push(value){const snapshot=JSON.stringify(value);if(snapshot===states[cursor])return;states=states.slice(0,cursor+1);states.push(snapshot);if(states.length>max)states.shift();cursor=states.length-1},
  undo(){if(cursor>0)cursor--;return JSON.parse(states[cursor])},
  redo(){if(cursor<states.length-1)cursor++;return JSON.parse(states[cursor])},
  current(){return JSON.parse(states[cursor])},
  get canUndo(){return cursor>0},
  get canRedo(){return cursor<states.length-1}
 };
}
