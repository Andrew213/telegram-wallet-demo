import {TFunction} from "i18next";
import {z} from "zod";

import * as icons from "@/assets/icons/Currency";
import {Flavor} from "@/utils";

export namespace Currency {
  export const nameToCodeMap = {
    LekAlbania: 8,
    AustralianDollar: 36,
    Euro: 978,
    AzerbaijanManat: 944,
    AlgerianDinar: 12,
    EastCaribbeanDollar: 951,
    Kwanza: 973,
    ArgentinePeso: 32,
    ArmenianDram: 51,
    ArubanGuilder: 533,
    Afghani: 971,
    BahamianDollar: 44,
    Taka: 50,
    BarbadosDollar: 52,
    BahrainiDinar: 48,
    BelarusianRuble: 933,
    BelizeDollar: 84,
    CFAFranc: 952,
    BermudianDollar: 60,
    Lev: 975,
    Boliviano: 68,
    ConvertibleMark: 977,
    Pula: 72,
    BrazilianReal: 986,
    BruneiDollar: 96,
    BurundiFranc: 108,
    Ngultrum: 64,
    Vatu: 548,
    PoundSterling: 826,
    Forint: 348,
    Bolivar: 862,
    Rupee: 360,
    Dong: 704,
    CFAFrancBEAC: 950,
    Gourde: 332,
    GuyanaDollar: 328,
    Dalasi: 270,
    Cedi: 288,
    Quetzal: 320,
    GuineaFranc: 324,
    GibraltarPound: 292,
    Lempira: 340,
    HongKongDollar: 344,
    Lari: 981,
    DanishKrone: 208,
    DjiboutiFranc: 262,
    DominicanPeso: 214,
    EgyptianPound: 818,
    Kwacha: 894,
    ZimbabweDollar: 716,
    NewIsraeliShekel: 376,
    IndianRupee: 356,
    JordanianDinar: 400,
    IraqiDinar: 368,
    IranianRial: 364,
    IcelandicKrona: 352,
    YemeniRial: 886,
    CapeVerdeEscudo: 132,
    Tenge: 398,
    CaymanIslandsDollar: 136,
    Riel: 116,
    CanadianDollar: 124,
    QatariRiyal: 634,
    KenyanShilling: 404,
    CypriotPound: 196,
    KyrgyzstaniSom: 417,
    Renminbi: 156,
    NorthKoreanWon: 408,
    ColombianPeso: 170,
    ComorianFranc: 174,
    CongoleseFranc: 976,
    CostaRicanColon: 188,
    CubanPeso: 192,
    KuwaitiDinar: 414,
    Kip: 418,
    LatvianLat: 428,
    Loti: 426,
    Rand: 710,
    LiberianDollar: 430,
    LebanesePound: 422,
    LibyanDinar: 434,
    LithuanianLitas: 440,
    SwissFranc: 756,
    MauritianRupee: 480,
    Ouguiya: 478,
    MalagasyAriary: 969,
    Pataca: 446,
    MacedonianDenar: 807,
    MalawiKwacha: 454,
    MalaysianRinggit: 458,
    Rufiyaa: 462,
    MalteseLira: 470,
    MoroccanDirham: 504,
    SpecialDrawingRights: 960,
    MexicanPeso: 484,
    Metical: 943,
    MoldovanLeu: 498,
    Tugrik: 496,
    Kyat: 104,
    NamibianDollar: 516,
    NepaleseRupee: 524,
    Naira: 566,
    NetherlandsAntilleanGuilder: 532,
    Cordoba: 558,
    NewZealandDollar: 554,
    NorwegianKrone: 578,
    UAEDirham: 784,
    OmaniRial: 512,
    SaintHelenaPound: 654,
    PakistaniRupee: 586,
    Balboa: 590,
    Kina: 598,
    Guarani: 600,
    NuevoSol: 604,
    Zloty: 985,
    RussianRuble: 643,
    RwandanFranc: 646,
    RomanianLeu: 946,
    Tala: 882,
    Dobra: 678,
    SaudiRiyal: 682,
    Lilangeni: 748,
    SeychelloisRupee: 690,
    SerbianDinar: 891,
    SingaporeDollar: 702,
    SyrianPound: 760,
    SlovakKoruna: 703,
    Tolar: 705,
    SolomonIslandsDollar: 90,
    SomaliShilling: 706,
    SudaneseDinar: 736,
    SurinameseDollar: 968,
    USADollar: 840,
    Leone: 694,
    Somoni: 972,
    Baht: 764,
    TaiwanDollar: 901,
    TanzanianShilling: 834,
    Paanga: 776,
    TrinidadTobagoDollar: 780,
    TunisianDinar: 788,
    TurkmenistanManat: 795,
    TurkishLira: 949,
    UgandanShilling: 800,
    UzbekistanSum: 860,
    Hryvnia: 980,
    UruguayanPeso: 858,
    FijiDollar: 242,
    PhilippinePeso: 608,
    FalklandIslandsPound: 238,
    CFPFranc: 953,
    CroatianKuna: 191,
    CzechKoruna: 203,
    ChileanPeso: 152,
    SwedishKrona: 752,
    SriLankanRupee: 144,
    Nakfa: 232,
    EstonianKrone: 233,
    EthiopianBirr: 230,
    SouthKoreanWon: 410,
    JamaicanDollar: 388,
    JapaneseYen: 392,
    NoCurrency: 999,
    Usdt: 1001,
    Busd: 1002,
    Lari2: 4217,
  } as const;

  export function getRuName(code: Code, t: TFunction) {
    return t(`currencies.${code}`, {defaultValue: code});
  }

  export const CodeSchema = z.custom<Flavor<number, "CurrencyCode">>(val => {
    return typeof val === "number";
  });
  export type Code = z.infer<typeof CodeSchema>;

  export const AliasSchema = z
    .custom<Flavor<string, "CurrencyAlias">>(val => typeof val === "string")
    .nullable();
  export type Alias = z.infer<typeof AliasSchema>;

  type Icon = keyof typeof icons;
  export function getIcon(alias: Alias) {
    if (!alias) {
      return undefined;
    }

    return alias in icons
      ? (`Currency${alias}` as `Currency${Icon}`)
      : undefined;
  }

  const colors = [
    "USD",
    "RUB",
    "EUR",
    "KZT",
    "TRY",
    "UZS",
    "GEL",
    "AZN",
    "KGS",
    "USDT",
    "BUSD",
    "UAH",
    "INR",
  ] as const;
  type Color = (typeof colors)[number];
  export function getColor(alias: Alias) {
    if (!alias) {
      return undefined;
    }

    return ([...colors] as string[]).includes(alias)
      ? (`currency-${alias}` as `currency-${Color}`)
      : undefined;
  }
}
