[#include "/gato-lib/templates/includes/areamacros.ftl"]
[#list components as component]
  <li>[@cms.component content=component /]</li>
[/#list]
[@ifneedsnewbar components def]
	<li class="listItems_add" cms:add="bar"></li>
[/@ifneedsnewbar]
