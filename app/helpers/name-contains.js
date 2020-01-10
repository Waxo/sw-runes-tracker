import {helper} from '@ember/component/helper';

function contains([name, filter]) {
  return filter && name.toLowerCase().indexOf(filter.toLowerCase()) >= 0
    ? 'color:deeppink'
    : '';
}

export default helper(contains);
