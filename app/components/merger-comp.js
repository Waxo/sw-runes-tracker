import Component from '@ember/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import moment from 'moment';
import csvMaker from '../utils/csv-maker';

const fs = requireNode('fs-extra');
const R = requireNode('ramda');

export default class MergerComp extends Component {
  @service importStore;
  @service swrtStore;
  @service paperToaster;

  @action
  async merge() {
    const json = this.importStore.get();
    this.swrtStore.updateDB(json);
    this.paperToaster.show('Everything ready');
  }

  @action
  async export() {
    const path = `${this.swrtStore.getPath()}\\swrt-export-${moment().format(
      'YYYY-MM-DD'
    )}.json`;
    fs.writeJSON(path, this.swrtStore.getDB());
    this.paperToaster.show(`Exported to JSON (${path})`);
  }

  @action
  async exportCSV() {
    const path = `${this.swrtStore.getPath()}\\swrt-export-${moment().format(
      'YYYY-MM-DD'
    )}.csv`;
    const idx = [
      'rune_id',
      'firstSeen',
      'lastUsage',
      'oldLocations',
      'currentLocation',
      'star',
      'set',
      'primary',
      'inate',
      'prefix',
      'HP',
      'HP%',
      'ATK',
      'ATK%',
      'DEF',
      'DEF%',
      'SPD',
      'CR',
      'CD',
      'RES',
      'ACC'
    ].join(',');
    fs.writeFile(path, R.join('\n', [idx, csvMaker(this.swrtStore.getDB())]));
    this.paperToaster.show(`Exported to CSV (${path})`);
  }
}
