import mapping from './mapping';

const R = requireNode('ramda');

const effectTypeStrings_ = (type, value) =>
  R.prop(type, {
    0: '',
    1: `HP +${value}`,
    2: `HP ${value}%`,
    3: `ATK +${value}`,
    4: `ATK ${value}%`,
    5: `DEF +${value}`,
    6: `DEF ${value}%`,
    8: `SPD +${value}`,
    9: `CRI Rate ${value}%`,
    10: `CRI Dmg ${value}%`,
    11: `Resistance ${value}%`,
    12: `Accuracy ${value}%`
  });

const applyStat = ([type, value]) => effectTypeStrings_(type, value);

const reduceStat_ = ([type, value, , grind]) => [
  type,
  grind ? value + grind : value
];

const getSetName_ = R.pipe(
  R.append(R.__, ['rune', 'sets']),
  R.path(R.__, mapping)
);

const cleanRunes_ = R.pipe(
  R.pick([
    'rune_id',
    'slot_no',
    'class',
    'set_id',
    'upgrade_curr',
    'pri_eff',
    'prefix_eff',
    'sec_eff',
    'name',
    'currentLocation'
  ]),
  R.converge(R.assoc('star'), [R.prop('class'), R.identity]),
  R.dissoc('class'),
  R.over(R.lensProp('pri_eff'), applyStat),
  R.over(R.lensProp('prefix_eff'), applyStat),
  R.over(R.lensProp('sec_eff'), R.map(reduceStat_)),
  R.over(R.lensProp('set_id'), getSetName_)
);

const getMonsterNameFromMapping_ = R.pipe(
  R.prop('unit_master_id'),
  R.append(R.__, ['monster', 'names']),
  R.path(R.__, mapping)
);

const prepareMonster_ = R.pipe(
  R.pick(['unit_id', 'unit_master_id', 'runes']),
  R.converge(R.assoc('name'), [getMonsterNameFromMapping_, R.identity])
);

const duplicateMonsterHandling_ = monsterList_ => {
  const dict = {};

  const append_ = name => {
    if (name && dict[name]) {
      return `${name} ${++dict[name]}`;
    } else {
      dict[name] = 1;
      return name;
    }
  };

  return R.map(R.over(R.lensProp('name'), append_), monsterList_);
};

const putNameInRunes_ = R.pipe(
  R.converge(R.over(R.lensProp('runes')), [
    R.pipe(R.prop('name'), R.assoc('currentLocation'), R.map),
    R.identity
  ]),
  R.prop('runes'),
  R.map(cleanRunes_)
);

const prepareMonsters = R.pipe(
  R.map(prepareMonster_),
  duplicateMonsterHandling_,
  R.map(putNameInRunes_)
);

const cleanRunes = R.map(cleanRunes_);

export {prepareMonsters, cleanRunes, applyStat};
