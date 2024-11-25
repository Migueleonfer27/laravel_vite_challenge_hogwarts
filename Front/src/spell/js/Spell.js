export class Spell {
    constructor(id, name, level, attack, defense, damage, healing, summon, action, validation_status, created_at, updated_at, creator ) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.attack = attack;
        this.defense = defense;
        this.damage = damage;
        this.healing = healing;
        this.summon = summon;
        this.action = action;
        this.validation_status = validation_status;
        this.creator = creator;
    }
}