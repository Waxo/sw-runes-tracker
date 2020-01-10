import Service from '@ember/service';
import parseRunes from '../utils/parse-runes';

export default class ImportStoreService extends Service {
  jsonImport = {};

  save(json) {
    this.jsonImport = parseRunes(json);
  }

  get() {
    return this.jsonImport;
  }
}
