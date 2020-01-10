import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

const R = requireNode('ramda');

export default class LockRuneRoute extends Route {
  @service swrtStore;

  model() {
    const monsters = this.swrtStore.getMonsters();
    return R.map(R.pipe(
      R.objOf('name'),
      R.assoc('checked', false)
    ))(monsters);
  }
}
