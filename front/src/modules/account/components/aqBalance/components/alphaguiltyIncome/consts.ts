import { ILevel } from "@models";

export const investorRuleLevels: ILevel[] = [
  {
    id: 26,
    number: 1,
    tokensFrom: 0,
    name: "Shiller",
    avatar: "3ShBsCgwuJ.png",
  },
  {
    id: 27,
    number: 2,
    tokensFrom: 331,
    name: "Shiller",
    avatar: "3ShBsCgwuJ.png",
  },
  {
    id: 28,
    number: 3,
    tokensFrom: 661,
    name: "Shiller",
    avatar: "3ShBsCgwuJ.png",
  },
  {
    id: 29,
    number: 4,
    tokensFrom: 1001,
    name: "Ape",
    avatar: "EYdIxfpsnE.png",
  },
  {
    id: 30,
    number: 5,
    tokensFrom: 1661,
    name: "Ape",
    avatar: "EYdIxfpsnE.png",
  },
  {
    id: 31,
    number: 6,
    tokensFrom: 2321,
    name: "Ape",
    avatar: "EYdIxfpsnE.png",
  },
  {
    id: 32,
    number: 7,
    tokensFrom: 3001,
    name: "Great Ape",
    avatar: "06KPzeOye6.png",
  },
  {
    id: 33,
    number: 8,
    tokensFrom: 3501,
    name: "Great Ape",
    avatar: "06KPzeOye6.png",
  },
  {
    id: 34,
    number: 9,
    tokensFrom: 4001,
    name: "Great Ape",
    avatar: "06KPzeOye6.png",
  },
  {
    id: 35,
    number: 10,
    tokensFrom: 4501,
    name: "Great Ape",
    avatar: "06KPzeOye6.png",
  },
  {
    id: 36,
    number: 11,
    tokensFrom: 5001,
    name: "Degen",
    avatar: "eQzsuA0Qve.png",
  },
  {
    id: 37,
    number: 12,
    tokensFrom: 5601,
    name: "Degen",
    avatar: "eQzsuA0Qve.png",
  },
  {
    id: 38,
    number: 13,
    tokensFrom: 6201,
    name: "Degen",
    avatar: "eQzsuA0Qve.png",
  },
  {
    id: 39,
    number: 14,
    tokensFrom: 6801,
    name: "Degen",
    avatar: "eQzsuA0Qve.png",
  },
  {
    id: 40,
    number: 15,
    tokensFrom: 7401,
    name: "Degen",
    avatar: "eQzsuA0Qve.png",
  },
  {
    id: 41,
    number: 16,
    tokensFrom: 8001,
    name: "Guilty",
    avatar: "HICKfTge2S.png",
  },
  {
    id: 42,
    number: 17,
    tokensFrom: 8401,
    name: "Guilty",
    avatar: "HICKfTge2S.png",
  },
  {
    id: 43,
    number: 18,
    tokensFrom: 8801,
    name: "Guilty",
    avatar: "HICKfTge2S.png",
  },
  {
    id: 44,
    number: 19,
    tokensFrom: 9201,
    name: "Guilty",
    avatar: "HICKfTge2S.png",
  },
  {
    id: 45,
    number: 20,
    tokensFrom: 9601,
    name: "Guilty",
    avatar: "HICKfTge2S.png",
  },
  {
    id: 46,
    number: 21,
    tokensFrom: 10001,
    name: "Alpha",
    avatar: "HHY7lRclZZ.png",
  },
  {
    id: 47,
    number: 22,
    tokensFrom: 11001,
    name: "Alpha",
    avatar: "HHY7lRclZZ.png",
  },
  {
    id: 48,
    number: 23,
    tokensFrom: 12001,
    name: "Alpha",
    avatar: "HHY7lRclZZ.png",
  },
  {
    id: 49,
    number: 24,
    tokensFrom: 13001,
    name: "Alpha",
    avatar: "HHY7lRclZZ.png",
  },
  {
    id: 50,
    number: 25,
    tokensFrom: 14001,
    name: "Alpha",
    avatar: "HHY7lRclZZ.png",
  },
];

const getNamedLevels = (levels: ILevel[]): ILevel[] => {
  const namedLevels: ILevel[] = [
    {
      name: levels[0].name,
      tokensFrom: levels[0].tokensFrom,
      place: `${levels[0].number}`,
      avatar: levels[0].avatar,
      id: levels[0].id,
      number: levels[0].number,
    },
  ];

  let lastPlace = levels[0].number;
  levels.forEach((level, index) => {
    if (level.name != namedLevels[namedLevels.length - 1].name) {
      if (levels[index - 1].number != lastPlace) {
        namedLevels[namedLevels.length - 1].place = `${
          namedLevels[namedLevels.length - 1].place
        }-${levels[index - 1].number}`;
      }
      lastPlace = level.number;
      namedLevels.push({
        name: level.name,
        tokensFrom: level.tokensFrom,
        place: `${level.number}`,
        avatar: level.avatar,
        id: level.id,
        number: levels[0].number,
      });
    }
  });
  namedLevels[namedLevels.length - 1].place = `${
    namedLevels[namedLevels.length - 1].place
  }-${levels[levels.length - 1].number}`;
  return namedLevels;
};

export const namedLevels: ILevel[] = getNamedLevels(investorRuleLevels);
