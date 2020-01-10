import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import {applyStat} from '../utils/runes-parser-helper';

const R = requireNode('ramda');

export default class ViewRuneRoute extends Route {
  @service swrtStore;

  model() {
    return R.map(
      R.converge(R.assoc('subs'), [
        R.pipe(R.prop('sec_eff'), R.map(applyStat), R.join(', ')),
        R.identity
      ]),
      this.swrtStore.getDB()
    );
  }
}
