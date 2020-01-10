import Component from '@ember/component';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {inject as service} from '@ember/service';

const fs = requireNode('fs-extra');

export default class SwrtUploadComp extends Component {
  @service swrtStore;
  @service paperToaster;
  @tracked isLoaded;

  @action
  async swrt(f) {
    this.swrtStore.savePath(f.files[0].path, true);
    this.swrtStore.importSWRT(await fs.readJSON(f.files[0].path));
    this.isLoaded = true;
    this.paperToaster.show('SWRT Database loaded');
  }
}
