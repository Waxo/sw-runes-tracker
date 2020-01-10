import Component from '@ember/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';

const fs = requireNode('fs-extra');

export default class SwexUploadComp extends Component {
  @service importStore;
  @service swrtStore;
  @service paperToaster;
  @tracked isLoaded;

  @action
  async swex(f) {
    this.swrtStore.savePath(f.files[0].path);
    this.importStore.save(await fs.readJSON(f.files[0].path));
    this.isLoaded = true;
    this.paperToaster.show('SWEX json loaded');
  }
}
