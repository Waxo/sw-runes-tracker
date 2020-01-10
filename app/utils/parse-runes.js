import {prepareMonsters, cleanRunes} from './runes-parser-helper';

const R = requireNode('ramda');

const parseRunes = R.pipe(
  R.pick(['unit_list', 'runes']),
  R.over(R.lensProp('unit_list'), prepareMonsters),
  R.over(R.lensProp('runes'), cleanRunes),
  R.converge(R.concat, [R.prop('unit_list'), R.prop('runes')]),
  R.flatten
);

export default parseRunes;
