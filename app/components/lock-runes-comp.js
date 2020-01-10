import Component from '@ember/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

const R = requireNode('ramda');

export default class MergerComp extends Component {
  @service swrtStore;
  @service paperToaster;
  @tracked monsters;

  @action
  async lockRunes() {
    const monstersToLock = R.pipe(
      R.filter(R.propEq('checked', true)),
      R.pluck('name')
    )(this.monsters);

    this.swrtStore.lockRunes(monstersToLock);
    this.paperToaster('Runes Updated');
  }
}

