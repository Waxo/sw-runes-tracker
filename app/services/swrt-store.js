import Service from '@ember/service';
import {
  bulkUpdateMonstersRunes,
  mergeCurrentRunesWithDatabase
} from "../utils/tracker-utils";

const R = requireNode('ramda');

export default class SwrtStoreService extends Service {
  oldDB = [];
  mergedDB = [];
  exportPath = '';

  savePath(path, forceOverride = false) {
    if (!this.exportPath || forceOverride) {
      this.exportPath = R.pipe(
        R.split('\\'),
        R.init,
        R.join('\\')
      )(path);
    }
  }

  getPath() {
    return this.exportPath;
  }

  importSWRT(data) {
    this.oldDB = data;
  }

  updateDB(jsonData) {
    this.mergedDB = mergeCurrentRunesWithDatabase(this.oldDB, jsonData);
  }

  lockRunes(monsters) {
    this.mergedDB = bulkUpdateMonstersRunes(monsters, this.mergedDB);
  }

  getMonsters() {
    return R.pipe(
      R.pluck('currentLocation'),
      R.uniq,
      R.sort(R.comparator(R.lt)),
      R.filter(R.complement(R.isNil))
    )(this.mergedDB);
  }

  getDB() {
    return this.mergedDB;
  }
}
