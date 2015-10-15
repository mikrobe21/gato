[#macro listnav position]
  [#list cmsfn.ancestors(cmsfn.page(content)) as page]
    [#list cmsfn.children(page['navBlocks'], 'mgnl:component') as sidenav]
      [#if (sidenav.inherit!false) && sidenav.position! == position]
        [@cms.component content=sidenav editable=false contextAttributes={ "inheritedfrom" : page }/]
      [/#if]
    [/#list]
  [/#list]
[/#macro]

[@listnav position='top' /]
[#list components as component]
  [@cms.component content=component /]
[/#list]
[#if cmsfn.isEditMode()]
  <div cms:add="box"></div>
[/#if]
[@listnav position='bottom' /]
