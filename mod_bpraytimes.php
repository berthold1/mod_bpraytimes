<?php
/**
 * @package    bpraytimes
 * @version    v3.2
 * @email      jiboncosta57@gmail.com
 * @author     Jibon Lawrence Costa
 * @link       http://www.hoicoimasti.com
 * @copyright  Copyright (C) 2012 hoicoimasti.com All Rights Reserved
 * @license    http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */
defined('_JEXEC') or die('Restricted access');

$moduleclass_sfx = trim($params->get('moduleclass_sfx'));

$base_uri = JURI::base();
$mode = $params->get('mode', 1);
$document = JFactory::getDocument();
$document->addScript('/modules/mod_bpraytimes/asset/praytimes.js');
$document->addScript('/modules/mod_bpraytimes/asset/bpraytimes.js');
$document->addStyleSheet('/modules/mod_bpraytimes/asset/praytimes.css');
$rand = 'bpraytimes'.rand();
?>

<div class="bpraytimes<?=$moduleclass_sfx?>">
	<div class="pt_header">
		<form id="<?=$rand?>_form" class="pt_form">
			<div class="pt_field pt_full">
				<span>Pays:</span>
				<div><input type="text" id="<?=$rand?>_country" size="50" value="France"></div>
			</div>
			<div class="pt_field">
				<span>Ville:</span>
				<div><input type="text" id="<?=$rand?>_city" size="50" value="Paris"></div>
			</div>
			<span class="pt_field pt_other pt_full" onclick="pt_extend();">Autres options</span>
			<div id="<?=$rand?>_extend" class="pt_extend">
				<div class="pt_field">
					<span>Année:</span>
					<div><input type="text" value="" id="<?=$rand?>_year" size="4"></div>
				</div>
				<div class="pt_field">
					<span>Mois:</span>
					<div><select id="<?=$rand?>_month" size="1">
						<option value="0">Janvier</option>
						<option value="1">Février</option>
						<option value="2">Mars</option>
						<option value="3">Avril</option>
						<option value="4">Mai</option>
						<option value="5">Juin</option>
						<option value="6">Juillet</option>
						<option value="7">Août</option>
						<option value="8">Septembre</option>
						<option value="9">Octobre</option>
						<option value="10">Novembre</option>
						<option value="11">Décembre</option>
						<option value="-1">Tous</option>
					</select></div>
				</div>
				<div style="display:none;">
		 			<span>Latitude:</span>
		 			<div><input type="text" value="" id="<?=$rand?>_latitude" size="2"></div>
	 			</div>
	 			<div style="display:none;">
					<span>Longitude:</span>
					<div><input type="text" value="" id="<?=$rand?>_longitude" size="2"></div>
				</div>
				<div class="pt_field">
					<span>Time Zone:</span>
					<div><input type="text" value="" id="<?=$rand?>_timezone" size="2"></div>
				</div>
				<div class="pt_field">
					<span>DST:</span> 
					<div><select id="<?=$rand?>_dst" size="1">
						<option value="auto" selected="selected">Auto</option>
						<option value="0">0</option>
						<option value="1">1</option>
					</select></div>
				</div>
				<div class="pt_field">
					<span>Méthode:</span> 
					<div><select id="<?=$rand?>_method" size="1">
						<option value="UOIF" selected="selected">UOIF</option>
						<option value="MWL">Muslim World League (MWL)</option>
						<option value="ISNA">Islamic Society of North America (ISNA)</option>
						<option value="Egypt">Egyptian General Authority of Survey</option>
						<option value="Makkah">Umm al-Qura University, Makkah</option>
						<option value="Karachi">University of Islamic Sciences, Karachi</option>
						<option value="Jafari">Shia Ithna-Ashari (Jafari)</option>
						<option value="Tehran">Institute of Geophysics, University of Tehran</option>
					</select></div>
				</div>
				<div class="pt_field">
					<span>Format heure:</span>
					<div><a id="<?=$rand?>_timeformat" title="Change clock format"></a>
					<input type="hidden" id="<?=$rand?>_timefmtval" value="1"></div>
				</div>
			</div>
			<div id="<?=$rand?>_error" class="pt_field pt_error"></div>
		</form>
	</div>
	<div class="pt_body">
		<table class="pt_table" id="<?=$rand?>_tabletime"></table>
	</div>
	
	<script type="text/javascript">
		function pt_extend()
		{
			$("#<?=$rand?>_extend").css('display', function(index) { return $(this).css('display') == 'block' ? 'none' : 'block'; });
		}
		
		var pT = new BPrayTimes('#<?=$rand?>', <?=$mode?>);
	</script>
</div>