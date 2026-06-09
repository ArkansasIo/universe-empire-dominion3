<?php
if (isset($_SERVER['SCRIPT_FILENAME']) && realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__)
{
    http_response_code(200);
    header("Content-type: text/html; charset=utf-8");
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Universe Civilization: Empire At War Config</title>
<style>
body { background:#06131a; color:#d7eefc; font:14px/1.5 Verdana, Geneva, sans-serif; margin:0; padding:32px; }
.panel { background:rgba(0,0,0,.55); border:1px solid #0cf; border-radius:8px; max-width:760px; padding:24px; }
h1 { color:#fc0; font-size:20px; margin:0 0 12px; }
a { color:#0cf; }
code { color:#fc0; }
</style>
</head>
<body>
<div class="panel">
<h1>Universe Civilization: Empire At War Config Loaded</h1>
<p><code>config/config.php</code> is a configuration include file, not a public game page.</p>
<p>The direct access guard is working. Use <a href="../index.php">the home page</a>, <a href="../main.php">main menu</a>, or <a href="../diag.php">diagnostics</a> to test the game.</p>
</div>
</body>
</html>
<?php
    exit;
}

// Facebook Details
if (!defined('FB_ID')) define ('FB_ID', 	'');
if (!defined('FB_SECRET')) define ('FB_SECRET','');
if (!defined('FB_CHANNEL')) define ('FB_CHANNEL', '');

// All sched_* vars are in minutes.
// These are true minutes, no matter to what interval you're running the scheduler script.
// The scheduler will auto-adjust, possibly running many of the same events in a single call.
$sched_ticks                = 6;
$turns_per_tick             = 3;
$sched_turns                = 2;
$sched_ports                = 1;
$sched_planets              = 2;
$sched_igb                  = 2;
$sched_ranking              = 30;
$sched_news                 = 15;
$sched_degrade              = 6;
$sched_apocalypse           = 15;
$sched_thegovernor          = 1;
$sched_empire               = 10;
$doomsday_value             = 190000000;
$color_header               = '#500050';
$color_line1                = '#300030';
$color_line2                = '#400040';
$mine_hullsize              = 2;
$ewd_maxhullsize            = 15;
$sector_max                 = 1000;
$link_max                   = 10;
$universe_size              = 500;
$game_name                  = 'Universe Civilization: Empire At War';
$release_version            = '0.014';
$fed_max_hull               = 8;
$fed_max_score              = 1000000;
$max_ranks                  = 100;
$rating_combat_factor       = 0.8;
$server_closed              = false;
$account_creation_closed    = false;
$newbie_nice                = 'YES';
$newbie_hull                = '8';
$newbie_engines             = '8';
$newbie_power               = '8';
$newbie_computer            = '8';
$newbie_sensors             = '8';
$newbie_armor               = '8';
$newbie_shields             = '8';
$newbie_beams               = '8';
$newbie_torp_launchers      = '8';
$newbie_cloak               = '8';
$allow_fullscan             = true;
$allow_navcomp              = true;
$allow_ibank                = true;
$allow_genesis_destroy      = true;
$ibank_interest             = 0.00015;
$ibank_paymentfee           = 0.05;
$ibank_loaninterest         = 0.0010;
$ibank_loanfactor           = 0.10;
$ibank_loanlimit            = 0.25;
$default_prod_ore           = 20.0;
$default_prod_organics      = 20.0;
$default_prod_goods         = 20.0;
$default_prod_energy        = 20.0;
$default_prod_fighters      = 10.0;
$default_prod_torp          = 10.0;
$ore_price                  = 11;
$ore_delta                  = 5;
$ore_rate                   = 75000;
$ore_prate                  = 0.25;
$ore_limit                  = 500000000;
$organics_price             = 5;
$organics_delta             = 2;
$organics_rate              = 5000;
$organics_prate             = 0.5;
$organics_limit             = 500000000;
$goods_price                = 15;
$goods_delta                = 7;
$goods_rate                 = 75000;
$goods_prate                = 0.25;
$goods_limit                = 500000000;
$energy_price               = 3;
$energy_delta               = 1;
$energy_rate                = 75000;
$energy_prate               = 0.5;
$energy_limit               = 5000000000;
$inventory_factor           = 1;
$upgrade_cost               = 1000;
$upgrade_factor             = 2;
$level_factor               = 1.5;
$dev_genesis_price          = 100000000;
$dev_beacon_price           = 100;
$dev_emerwarp_price         = 100000000;
$dev_warpedit_price         = 100000;
$dev_minedeflector_price    = 10;
$dev_escapepod_price        = 100000;
$dev_fuelscoop_price        = 100000;
$dev_lssd_price             = 10000000000;
$fighter_price              = 50;
$fighter_prate              = 0.01;
$torpedo_price              = 25;
$torpedo_prate              = 0.025;
$torp_dmg_rate              = 10;
$credits_prate              = 3.0;
$armor_price                = 5;
$basedefense                = 1;
$colonist_price             = 5;
$colonist_production_rate   = 0.005;
$colonist_reproduction_rate = 0.0005;
$colonist_limit             = 200000000;
$planet_max_credits         = 10000000000000000;
$max_credits_allowed        = 10000000000000000;
$organics_consumption       = 0.05;
$starvation_death_rate      = 0.01;
$interest_rate              = 1.0003;
$base_ore                   = 10000;
$base_goods                 = 10000;
$base_organics              = 10000;
$base_credits               = 10000000;
$start_fighters             = 10;
$start_armor                = 10;
$start_credits              = 1000;
$start_energy               = 100;
$start_turns                = 1200;
$start_lssd                 = 'N';
$start_editors              = 0;
$start_minedeflectors       = 0;
$start_emerwarp             = 0;
$start_beacon               = 0;
$start_genesis              = 1;
$escape                     = 'N';
$scoop                      = 'N';
$max_turns                  = 2500;
$max_emerwarp               = 10;
$fullscan_cost              = 1;
$scan_error_factor          = 20;
$max_planets_sector         = 7;
$max_traderoutes_player     = 40;
$min_bases_to_own           = 4;
$default_lang               = 'english';
$IGB_min_turns              = 0;
$IGB_svalue                 = 0.15;
$IGB_trate                  = 1440;
$IGB_lrate                  = 1440;
$IGB_tconsolidate           = 10;
$corp_planet_transfers      = 0;
$min_value_capture          = 0;
$defence_degrade_rate       = 0.05;
$energy_per_fighter         = 0.10;
$bounty_maxvalue            = 0.15;
$bounty_ratio               = 0.75;
$bounty_minturns            = 500;
$display_password           = false;
$space_plague_kills         = 0.20;
$max_credits_without_base   = 10000000;
$sofa_on                    = true;
$ksm_allowed                = true;
$race_system_enabled        = true;
$playable_race_count        = 9;
$non_playable_race_count    = 32;
$default_race_code          = 'terran_union';
$race_stat_scale_min        = 1;
$race_stat_scale_max        = 10;
$xenobe_max                 = 10;
$xen_start_credits          = 1000000;
$xen_unemployment           = 100000;
$xen_aggression             = 100;
$xen_planets                = 5;
$xenstartsize               = 15;
$port_regenrate             = 10;
$footer_style               = 'old';
$sched_planet_valid_credits = false;
$max_upgrades_devices       = 45;
$max_emerwarp               = 10;
$max_genesis                = 10;
$max_beacons                = 10;
$max_warpedit               = 10;

$facility_hydroponics_food      = 1;
$facility_shipyard_parts        = 1;
$facility_solarplant_energy     = 1;
$facility_research_points       = 1;
$facility_mining_ore            = 1;
$requirement_hydro_credits      = 1000000000;
$requirement_hydro_organics     = 500000000;
$requirement_hydro_goods        = 100000000;
$requirement_banking_creds      = 10000000000;
$requirement_shipyard_credits   = 10000000000;
$requirement_shipyard_goods     = 500000000;
$requirement_shipyard_ore       = 500000000;
$requirement_solar_credits      = 500000000;
$requirement_solar_goods        = 100000000;
$requirement_solar_ore          = 100000000;
$requirement_medical_credits    = 5000000000;
$requirement_medical_goods      = 500000000;
$requirement_medical_cols       = ceil($colonist_limit/5);
$requirement_research_credits   = 5000000000;
$requirement_research_cols      = ceil($colonist_limit/3);
$requirement_military_credits   = 5000000000;
$requirement_military_cols      = ceil($colonist_limit/3);
$requirement_military_torps     = 75000000;
$requirement_military_figs      = 75000000;

$bounty_all_special         = true;
$bnt_ls                     = false;
$local_number_dec_point     = '.';
$local_number_thousands_sep = ',';
$language                   = 'english';
$link_forums                = 'http://forums.blacknova.net';
$email_server               = 'mail.example.com';
$adminpass                  = 'admin';
$admin_mail                 = 'admin@example.local';
$adminname                  = 'Local Admin';

/*
 * Temporary localhost debug login controls.
 * Keep disabled in normal operation.
 */
$debug_local_login_enabled  = false;
$debug_local_login_secret   = 'change-this-local-secret';
$debug_local_login_expires  = '+15 minutes';

/*
 * Expanded game data configuration.
 * These arrays are intentionally data-only so pages, setup scripts, and future
 * database seeders can consume richer game metadata without hard-coding values.
 */
$game_detail_config = array(
    'identity' => array(
        'name' => $game_name,
        'version' => $release_version,
        'genre' => 'turn-based space trading, empire building, exploration, and combat',
        'tone' => 'frontier sci-fi with ancient-gate infrastructure, xenobe threats, and faction warfare',
        'core_loops' => array('trade', 'upgrade', 'explore', 'colonize', 'research', 'defend', 'conquer')
    ),
    'world_generation' => array(
        'sector_count' => $sector_max,
        'max_links_per_sector' => $link_max,
        'realspace_scale' => $universe_size,
        'max_planets_per_sector' => $max_planets_sector,
        'seed_systems_enabled' => true,
        'default_seed_catalog_size' => 1000,
        'planet_biome_types' => array('terran', 'desert', 'ice', 'toxic', 'volcanic', 'oceanic', 'barren', 'crystalline', 'storm'),
        'hazard_types' => array('radiation', 'plasma_storm', 'gravity_shear', 'biohazard', 'sentinel_activity', 'pirate_patrol')
    ),
    'player_start' => array(
        'credits' => $start_credits,
        'turns' => $start_turns,
        'fighters' => $start_fighters,
        'armor' => $start_armor,
        'energy' => $start_energy,
        'genesis_devices' => $start_genesis,
        'escape_pod' => $escape,
        'fuel_scoop' => $scoop
    ),
    'economy' => array(
        'resources' => array(
            'ore' => array('base_price' => $ore_price, 'delta' => $ore_delta, 'port_rate' => $ore_rate, 'planet_rate' => $ore_prate, 'limit' => $ore_limit),
            'organics' => array('base_price' => $organics_price, 'delta' => $organics_delta, 'port_rate' => $organics_rate, 'planet_rate' => $organics_prate, 'limit' => $organics_limit),
            'goods' => array('base_price' => $goods_price, 'delta' => $goods_delta, 'port_rate' => $goods_rate, 'planet_rate' => $goods_prate, 'limit' => $goods_limit),
            'energy' => array('base_price' => $energy_price, 'delta' => $energy_delta, 'port_rate' => $energy_rate, 'planet_rate' => $energy_prate, 'limit' => $energy_limit)
        ),
        'banking' => array(
            'enabled' => $allow_ibank,
            'interest' => $ibank_interest,
            'payment_fee' => $ibank_paymentfee,
            'loan_interest' => $ibank_loaninterest,
            'loan_factor' => $ibank_loanfactor,
            'loan_limit' => $ibank_loanlimit
        )
    )
);

$race_detail_config = array(
    'enabled' => $race_system_enabled,
    'playable_count' => $playable_race_count,
    'non_playable_count' => $non_playable_race_count,
    'default_race_code' => $default_race_code,
    'stat_scale' => array('min' => $race_stat_scale_min, 'max' => $race_stat_scale_max),
    'stat_groups' => array(
        'biology' => array('vitality', 'adaptation', 'reproduction', 'toxicity_resistance'),
        'society' => array('diplomacy', 'discipline', 'espionage', 'trade_affinity'),
        'warfare' => array('piloting', 'boarding', 'ground_combat', 'fleet_coordination'),
        'science' => array('research_speed', 'engineering', 'xenoarchaeology', 'gate_theory')
    ),
    'playable_races' => array(
        'terran_union' => array('name' => 'Terran Union', 'class' => 'adaptive', 'subclass' => 'industrial diplomat', 'type' => 'human', 'favored_systems' => array('trade', 'research', 'colonies')),
        'elyrian_concord' => array('name' => 'Elyrian Concord', 'class' => 'psionic', 'subclass' => 'empathic navigator', 'type' => 'near-human', 'favored_systems' => array('diplomacy', 'sensors', 'stargates')),
        'kharax_brood' => array('name' => 'Kharax Brood', 'class' => 'hive', 'subclass' => 'organic swarm', 'type' => 'insectoid', 'favored_systems' => array('fighters', 'colonies', 'boarding')),
        'orrakai_dynasty' => array('name' => 'Orrakai Dynasty', 'class' => 'martial', 'subclass' => 'honor fleet', 'type' => 'reptilian', 'favored_systems' => array('armor', 'torpedoes', 'planet_defense')),
        'vespari_syndicate' => array('name' => 'Vespari Syndicate', 'class' => 'mercantile', 'subclass' => 'free-port cartel', 'type' => 'avian', 'favored_systems' => array('trade', 'banking', 'smuggling')),
        'myridian_collective' => array('name' => 'Myridian Collective', 'class' => 'synthetic', 'subclass' => 'machine polity', 'type' => 'ai', 'favored_systems' => array('research', 'automation', 'shipyards')),
        'thalassan_current' => array('name' => 'Thalassan Current', 'class' => 'aquatic', 'subclass' => 'bioengineer', 'type' => 'amphibian', 'favored_systems' => array('organics', 'medical', 'terraforming')),
        'noktari_veil' => array('name' => 'Noktari Veil', 'class' => 'stealth', 'subclass' => 'shadow scout', 'type' => 'nocturnal', 'favored_systems' => array('cloak', 'espionage', 'ambush')),
        'sauren_ascendancy' => array('name' => 'Sauren Ascendancy', 'class' => 'ancient', 'subclass' => 'gate heir', 'type' => 'precursor-descended', 'favored_systems' => array('stargates', 'artifacts', 'capital_ships'))
    ),
    'non_playable_race_archetypes' => array(
        'xenobe_warlord', 'void_nomad', 'sentinel_drone', 'pirate_clan', 'merchant_house', 'ancient_guardian', 'bio_plague_cult', 'rogue_ai',
        'crystal_mind', 'nebula_hunter', 'gatekeeper_order', 'terraformer_remnant', 'clone_baron', 'asteroid_tribe', 'dark_fleet', 'relic_priest',
        'quantum_shade', 'orbital_scavenger', 'plasma_raider', 'peacekeeper_cell', 'wormhole_oracle', 'deep_core_miner', 'radiant_swarm', 'ice_monk',
        'gene_vault', 'chronicle_archive', 'solar_knight', 'dust_reaver', 'hydro_cartel', 'storm_binder', 'forge_clan', 'silicate_hive'
    )
);

$scifi_detail_config = array(
    'travel_systems' => array(
        'warp_links' => array('turn_cost' => 1, 'risk' => 'low', 'description' => 'Standard sector-to-sector movement through mapped links.'),
        'realspace' => array('turn_cost' => 'distance and engine based', 'risk' => 'medium', 'description' => 'Direct movement through open space.'),
        'stargates' => array('fuel' => 'energy', 'cooldown_turns' => 3, 'required_research' => 'gate_harmonics', 'description' => 'Stable public routes between major systems.'),
        'jumpgates' => array('fuel' => 'energy and parts', 'cooldown_turns' => 8, 'required_research' => 'jump_field_geometry', 'description' => 'Strategic gates for long-range empire logistics.')
    ),
    'ship_classes' => array(
        'scout' => array('role' => 'mapping and evasion', 'subclasses' => array('pathfinder', 'specter', 'courier')),
        'freighter' => array('role' => 'trade and hauling', 'subclasses' => array('bulk hauler', 'armored convoy', 'smuggler hold')),
        'frigate' => array('role' => 'balanced combat patrol', 'subclasses' => array('missile frigate', 'escort', 'interdictor')),
        'cruiser' => array('role' => 'front-line fleet combat', 'subclasses' => array('beam cruiser', 'carrier cruiser', 'siege cruiser')),
        'dreadnought' => array('role' => 'late-game capital warfare', 'subclasses' => array('planet breaker', 'gate bastion', 'command ark')),
        'monther_ship' => array('role' => 'mobile empire hub', 'subclasses' => array('ark mother', 'forge mother', 'hive mother'))
    ),
    'technology_tree' => array(
        'economy' => array('port analytics', 'cargo compression', 'trade AI', 'quantum banking'),
        'warfare' => array('beam focusing', 'torpedo telemetry', 'armor lamination', 'fighter doctrine'),
        'defense' => array('shield harmonics', 'mine deflection', 'base bastions', 'planetary grid'),
        'exploration' => array('deep sensors', 'hazard mapping', 'seed cartography', 'artifact decoding'),
        'gates' => array('gate harmonics', 'jump field geometry', 'stargate stabilization', 'precursor routing'),
        'colonies' => array('hydroponics', 'medical hubs', 'terraforming', 'colonist logistics')
    ),
    'research_rules' => array(
        'base_points_per_tick' => $facility_research_points,
        'soft_cap_per_project' => 1000000,
        'failure_modes' => array('prototype_loss', 'resource_overrun', 'gate_instability', 'data_corruption'),
        'success_rewards' => array('stat_bonus', 'new_device', 'new_route', 'production_bonus', 'defense_bonus')
    )
);

$universe_dominion_source_path = $_SERVER['DOCUMENT_ROOT'] . "/universe_empire_dominion3_src";
$universe_dominion_full_game_path = $_SERVER['DOCUMENT_ROOT'] . "/integrations/universe_empire_dominion3_full";
$universe_dominion_remote_url = "https://github.com/ArkansasIo/universe-empire-dominion3.git";

$lang = $default_lang;

$globalIncludesPath = $_SERVER['DOCUMENT_ROOT'] . "/global_includes.php";
if (is_file($globalIncludesPath)) {
    require($globalIncludesPath);
}
?>
