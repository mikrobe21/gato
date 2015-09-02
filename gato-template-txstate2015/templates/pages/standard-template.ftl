[#include "/gato-template/templates/includes/head.ftl"]

<!DOCTYPE HTML>
[#-- important variables set in here --]
[#include "includes/init.ftl"]
<html lang="en-US" xmlns="http://www.w3.org/1999/xhtml">
	<head>
		
		[@templatejs scripts=[
			'gato-template-txstate2015/resources/js/slideout.js',
			'gato-template-txstate2015/resources/js/common.js'
		]/]
		<script type="text/javascript" src="//bigspotteddog.github.io/ScrollToFixed/jquery-scrolltofixed-min.js"></script>
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js"></script>
		<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.2/fastclick.min.js"></script>
		
		[@templatecss files=[
			'gato-template-txstate2015/resources/css/normalize.min.css',
			'gato-template-txstate2015/resources/css/boilerplate.min.css',
			'gato-template-txstate2015/resources/css/gato.css',
			'gato-template-txstate2015/resources/css/txstate-ddmenu.css',
			'gato-template-txstate2015/resources/css/_customjs-modal.css'
		]/]
		<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/font-awesome.min.css"/>
		[@templatehead/]
		
	</head>
	<body>
		<nav id="menu" class="mobile_nav">
			[#import "includes/search.ftl" as search]
			[@search.searchBar true/]
			<div class="mobile_nav_container">
				<div class="mobile_trail">
					[#import "includes/breadcrumbs.ftl" as trail]
					[@trail.breadcrumbs hidetxstate=false isMobile=true/]
				</div>
				<h3 class="contact_us mobile_dept"><a href="#nowhere">${content.title}</a></h3>
				[#import "includes/main-menu.ftl" as menu]
				[@menu.menuBar isMobile=true/]
			</div>
			<!-- does social media need to go here -->
			<div class="mobile_super_container">
				[#assign globalData = cmsfn.asContentMap(cmsfn.nodeByPath('/global-data', 'website'))]
				[@cms.area name="superUser" content=globalData.webTools editable=false contextAttributes={"isMobile":true}/]		
			</div>
		</nav>
		[#if cmsfn.isEditMode()]
			<div id="gato-customjs-modal" class="gato-customjs-column">		
				[@cms.area name="customjs" /]
			</div>
			<div id="gato-customcss-modal" class="gato-customjs-column">
				[@cms.area name="customcss" /]
			</div>
		[/#if]
		<div id="panel" class="container">
			<!--"super user" menu bar -->
			[@cms.area name="superUser" content=globalData.webTools contextAttributes={"isMobile":false}/]
			<!-- banner with logo and search bar -->
			[#include "includes/top-banner.ftl"]
			<!--header image, parent organization, department name -->
			[#include "includes/header.ftl"]
		
			<!-- main menu -->
			<div class="top_nav">
    		<nav class="nav"> 
					[#--@menu.menuBar isMobile=false/--]
					[@mainmenu textmenu=true /]
				</nav> 
			</div> 
			<div class="page_content">
				<div class="row trail clearfix">
					<div class="column col-xs-2-3 flow-opposite">
						[@breadcrumbs/]
					</div>
				</div> <!-- end breadcrumbs -->
				<div class="row clearfix">
					[#assign hideSidebar = content.hideSidebar!false]
					[#assign mainContentClass = hideSidebar?string('col-xs-1','col-xs-3-4')]
					<div class="column ${mainContentClass}">
						[#include "includes/headline.ftl"]
						[@cms.area name="contentParagraph" /]
					</div>
					[#if hideSidebar == false]
					<div class="column col-xs-1-4 sidebar">
						[@cms.area name="navBlocks" /]
					</div>
					[/#if]
				</div>
			</div> <!-- end of page_content -->
			[#include "includes/footer.ftl"]
		</div> <!-- end of the container -->
	</body>
</html>