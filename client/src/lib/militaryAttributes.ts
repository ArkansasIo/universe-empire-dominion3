export interface Attribute {
  name: string;
  value: number;
  icon: string;
}

export interface Buff {
  name: string;
  type: string;
  duration: number;
  effect: { attribute: string; modifier: number };
  icon: string;
}

export interface Debuff {
  name: string;
  type: string;
  duration: number;
  effect: { attribute: string; modifier: number };
  icon: string;
}

// CLASS-SPECIFIC ATTRIBUTES
export const CLASS_ATTRIBUTES = {
  warrior: {
    strength: 15,
    endurance: 14,
    dexterity: 10,
    intelligence: 8,
    wisdom: 9,
    charisma: 10
  },
  knight: {
    strength: 14,
    endurance: 16,
    dexterity: 11,
    intelligence: 10,
    wisdom: 12,
    charisma: 13
  },
  berserker: {
    strength: 18,
    endurance: 13,
    dexterity: 9,
    intelligence: 7,
    wisdom: 8,
    charisma: 9
  },
  paladin: {
    strength: 13,
    endurance: 15,
    dexterity: 10,
    intelligence: 11,
    wisdom: 14,
    charisma: 15
  },
  ranger: {
    strength: 11,
    endurance: 12,
    dexterity: 16,
    intelligence: 12,
    wisdom: 13,
    charisma: 10
  },
  scout: {
    strength: 10,
    endurance: 11,
    dexterity: 17,
    intelligence: 11,
    wisdom: 12,
    charisma: 9
  },
  mage: {
    strength: 7,
    endurance: 9,
    dexterity: 10,
    intelligence: 17,
    wisdom: 13,
    charisma: 11
  },
  healer: {
    strength: 8,
    endurance: 11,
    dexterity: 10,
    intelligence: 14,
    wisdom: 16,
    charisma: 12
  },
  engineer: {
    strength: 11,
    endurance: 12,
    dexterity: 13,
    intelligence: 15,
    wisdom: 11,
    charisma: 10
  }
};

// TYPE-SPECIFIC BUFFS
export const TYPE_BUFFS = {
  infantry: [
    { name: "Shield Wall", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 5 }, icon: "🛡️" },
    { name: "Battle Cry", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 4 }, icon: "📢" },
    { name: "Stand Firm", type: "defensive", duration: 5, effect: { attribute: "endurance", modifier: 3 }, icon: "💪" }
  ],
  cavalry: [
    { name: "Charge!", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 6 }, icon: "🐎" },
    { name: "Mounted Superiority", type: "offensive", duration: 3, effect: { attribute: "speed", modifier: 4 }, icon: "⚡" },
    { name: "Lance Formation", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 3 }, icon: "🗡️" }
  ],
  archer: [
    { name: "Focus Fire", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 5 }, icon: "🎯" },
    { name: "Rapid Shot", type: "offensive", duration: 3, effect: { attribute: "speed", modifier: 3 }, icon: "⚡" },
    { name: "Eagle Eye", type: "utility", duration: 4, effect: { attribute: "accuracy", modifier: 15 }, icon: "👁️" }
  ],
  mage: [
    { name: "Arcane Power", type: "offensive", duration: 3, effect: { attribute: "attack", modifier: 7 }, icon: "✨" },
    { name: "Mana Shield", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 4 }, icon: "🔵" },
    { name: "Spell Amplify", type: "offensive", duration: 2, effect: { attribute: "intelligence", modifier: 5 }, icon: "📈" }
  ],
  support: [
    { name: "Blessing", type: "utility", duration: 4, effect: { attribute: "endurance", modifier: 4 }, icon: "✨" },
    { name: "Holy Protection", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 5 }, icon: "😇" },
    { name: "Healing Touch", type: "utility", duration: 2, effect: { attribute: "health_regen", modifier: 10 }, icon: "💚" }
  ],
  siege: [
    { name: "Heavy Strike", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 8 }, icon: "💥" },
    { name: "Unstoppable Force", type: "offensive", duration: 3, effect: { attribute: "strength", modifier: 6 }, icon: "🚀" },
    { name: "Fortified Position", type: "defensive", duration: 4, effect: { attribute: "defense", modifier: 6 }, icon: "🏰" }
  ]
};

// CLASS-SPECIFIC BUFFS
export const CLASS_BUFFS = {
  warrior: [
    { name: "Execute", type: "offensive", duration: 1, effect: { attribute: "attack", modifier: 10 }, icon: "⚔️" },
    { name: "Second Wind", type: "defensive", duration: 2, effect: { attribute: "health_regen", modifier: 5 }, icon: "💨" }
  ],
  knight: [
    { name: "Last Stand", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 8 }, icon: "🛡️" },
    { name: "Honor Bound", type: "utility", duration: 4, effect: { attribute: "charisma", modifier: 5 }, icon: "👑" }
  ],
  berserker: [
    { name: "Frenzy", type: "offensive", duration: 3, effect: { attribute: "attack", modifier: 12 }, icon: "🔥" },
    { name: "Rampage", type: "offensive", duration: 2, effect: { attribute: "strength", modifier: 8 }, icon: "💢" }
  ],
  paladin: [
    { name: "Divine Wrath", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 6 }, icon: "⚡" },
    { name: "Sacred Shield", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 7 }, icon: "✨" }
  ],
  ranger: [
    { name: "Multishot", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 8 }, icon: "🏹" },
    { name: "Evasion", type: "defensive", duration: 3, effect: { attribute: "speed", modifier: 5 }, icon: "💨" }
  ],
  scout: [
    { name: "Escape", type: "utility", duration: 2, effect: { attribute: "speed", modifier: 10 }, icon: "🏃" },
    { name: "Shadow Step", type: "defensive", duration: 2, effect: { attribute: "evasion", modifier: 20 }, icon: "👻" }
  ],
  mage: [
    { name: "Spell Surge", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 10 }, icon: "⚡" },
    { name: "Magic Absorption", type: "defensive", duration: 3, effect: { attribute: "intelligence", modifier: 4 }, icon: "🔵" }
  ],
  healer: [
    { name: "Mass Heal", type: "utility", duration: 1, effect: { attribute: "health_regen", modifier: 15 }, icon: "💚" },
    { name: "Divine Intervention", type: "defensive", duration: 3, effect: { attribute: "defense", modifier: 5 }, icon: "😇" }
  ],
  engineer: [
    { name: "Overclock", type: "offensive", duration: 2, effect: { attribute: "attack", modifier: 6 }, icon: "⚙️" },
    { name: "Repair", type: "utility", duration: 1, effect: { attribute: "health_regen", modifier: 8 }, icon: "🔧" }
  ]
};

// DEBUFFS (NEGATIVE EFFECTS)
export const DEBUFFS = {
  poison: { name: "Poisoned", type: "damage", duration: 3, effect: { attribute: "health", modifier: -2 }, icon: "☠️" },
  bleed: { name: "Bleeding", type: "damage", duration: 3, effect: { attribute: "health", modifier: -1 }, icon: "🩸" },
  stun: { name: "Stunned", type: "crowd_control", duration: 1, effect: { attribute: "speed", modifier: -10 }, icon: "⭐" },
  slow: { name: "Slowed", type: "crowd_control", duration: 2, effect: { attribute: "speed", modifier: -5 }, icon: "❄️" },
  weaken: { name: "Weakened", type: "debilitating", duration: 2, effect: { attribute: "attack", modifier: -4 }, icon: "💔" },
  curse: { name: "Cursed", type: "debilitating", duration: 3, effect: { attribute: "defense", modifier: -3 }, icon: "🔮" },
  blind: { name: "Blinded", type: "crowd_control", duration: 2, effect: { attribute: "accuracy", modifier: -20 }, icon: "👁️" },
  fear: { name: "Feared", type: "crowd_control", duration: 2, effect: { attribute: "morale", modifier: -30 }, icon: "😨" }
};

// TYPE-SPECIFIC DEBUFFS (IMMUNITIES/RESISTANCES)
export const TYPE_RESISTANCES = {
  infantry: { poison: 0.5, stun: 0.7, bleed: 1.2 },
  cavalry: { slow: 0.5, stun: 0.8, blind: 0.9 },
  archer: { close_range: 1.2, fear: 0.8, blind: 1.1 },
  mage: { poison: 0.9, curse: 0.6, physical: 1.2 },
  support: { poison: 0.7, curse: 0.5, damage: 0.8 },
  siege: { slow: 1.2, stun: 0.9, weaken: 0.7 }
};

export function getTroopStats(className: string): { [key: string]: number } {
  return CLASS_ATTRIBUTES[className as keyof typeof CLASS_ATTRIBUTES] || CLASS_ATTRIBUTES.warrior;
}

export function getClassBuffs(className: string): Buff[] {
  return CLASS_BUFFS[className as keyof typeof CLASS_BUFFS] || [];
}

export function getTypeBuffs(troopType: string): Buff[] {
  return TYPE_BUFFS[troopType as keyof typeof TYPE_BUFFS] || [];
}
