package edu.txstate.its.gato.setup;

import info.magnolia.dam.jcr.DamConstants;
import info.magnolia.jcr.util.NodeTypes;
import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.delta.BootstrapSingleResource;
import info.magnolia.module.delta.ChangeNodeTypeTask;
import info.magnolia.module.delta.CreateNodeTask;
import info.magnolia.module.delta.DeltaBuilder;
import info.magnolia.module.delta.FindAndChangeTemplateIdTask;
import info.magnolia.module.delta.MoveNodeTask;
import info.magnolia.module.delta.NodeExistsDelegateTask;
import info.magnolia.module.delta.RemoveNodeTask;
import info.magnolia.module.delta.RenameNodeTask;
import info.magnolia.module.delta.SetPropertyTask;
import info.magnolia.module.delta.Task;
import info.magnolia.module.InstallContext;
import info.magnolia.repository.RepositoryConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This class is optional and lets you manager the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GatoInternalVersionHandler extends DefaultModuleVersionHandler {
  public GatoInternalVersionHandler() {
    register(DeltaBuilder.update("1.0", "")
      .addTasks(installOrUpdateTasks())
    );
  }

  protected List<Task> installOrUpdateTasks() {
    List<Task> tasks = new ArrayList<Task>();
    return tasks;
  }

  @Override
  protected List<Task> getExtraInstallTasks(InstallContext installContext) {
    List<Task> tasks = new ArrayList<Task>(super.getExtraInstallTasks(installContext));

    //migrate testing-site documents from dms to dam
    tasks.add(new MoveDmsToDamTask());

    // move binary data from the website tree to the DAM
    tasks.add(new MoveRichEditorToDamTask("gato:components/texasState/texasEditor", "content"));
    tasks.add(new MoveRichEditorToDamTask("gato:components/texasState/texasTextImage", "text"));
    tasks.add(new MoveRichEditorToDamTask("gato:components/texasState/texas-slideshow-slide", "content"));
    tasks.add(new MoveRichEditorToDamTask("gato:components/widgets/accordion", "content"));
    tasks.add(new MoveFaqToDamTask());
    tasks.add(new MoveFileToDamTask("image", "images"));
    tasks.add(new MoveFileToDamTask("splash", "images"));
    tasks.add(new MoveFileToDamTask("rollover", "images"));
    tasks.add(new MoveFileToDamTask("bgimage", "images"));
    tasks.add(new MoveFileToDamTask("thumbnail", "images"));
    tasks.add(new MoveFileToDamTask("icon", "images"));
    tasks.add(new MoveFileToDamTask("document", "documents"));
    tasks.add(new MoveFileToDamTask("file", "documents"));

    tasks.add(new ResolveUploadVsDmsTask("gato:components/texasState/texasTextImage", "image", "imageDMS"));
    tasks.add(new ResolveUploadVsDmsTask("gato:components/texasState/gato-banner", "image", "imageDMS"));
    tasks.add(new ResolveUploadVsDmsTask("gato:components/widgets/feature/feature-slide", "image", "imageDMS"));
    tasks.add(new ResolveUploadVsDmsTask("gato:components/tsus/tsus-banner", "image", "imageDMS"));

    // additional tasks in our catch all migration to 5 task
    tasks.add(new Gato5MigrationTask("Gato Migrate to 5 task", "Generic update task for all the things we need to do to upgrade to Magnolia 5."));

    // list of templateIds that need to be changed {"oldtemplateid, newtemplateid"}
    String[][] templateNamePairs = {
      //component templateIds
      {"gato:components/texasState/customCssBlock",         "gato-component-cssjs:components/customcss"},
      {"gato:components/texasState/customjsBlock",          "gato-component-cssjs:components/customjs"},
      {"gato:components/texasState/department-directory",   "gato-component-dept-directory:components/departmentdirectory"},
      {"gato:components/texasState/texas-faq-hierarchy",    "gato-component-faq:components/faq-hierarchy"},
      {"gato:components/texasState/siteMap",                "gato-component-sitemap:components/sitemap"},
      {"gato:components/texasState/subPages",               "gato-component-sitemap:components/sitemap"},
      {"gato:components/texasState/imageGallery",           "gato-component-gallery:components/gallery"},
      {"gato:components/texasState/imageGalleryCell",       "gato-component-gallery:components/image"},
      {"gato:components/texasState/texas-dms",              "gato-component-documents:components/documents"},
      {"gato:components/texasState/texasDownload",          "gato-component-documents:components/documents"},
      {"gato:components/texasState/texas-rss",              "gato-component-rss:components/rss"},
      {"gato:components/texasState/texas-twitter",          "gato-component-twitter:components/twitter"},
      {"gato:components/texasState/texas-calendar-event",   "gato-component-events:components/events"},
      {"gato:components/texasState/texasTable",             "gato-template:components/table"},
      {"gato:components/texasState/texasEditor",            "gato-template:components/richeditor"},
      {"gato:components/texasState/texasTextImage",         "gato-template:components/textimage"},
      {"gato:components/texasState/texas-raw",              "gato-template:components/html"},
      {"gato:components/texasState/texas-iframe",           "gato-template:components/iframe"},
      {"gato:components/texasState/texasLink",              "gato-template:components/link"},
      {"gato:components/texasState/texas-misc-text",        "gato-template:components/misctext"},
      {"gato:components/texasState/social-media-link",      "gato-template:components/sociallink"},
      {"gato:components/texasState/image-link",             "gato-template:components/imagelink"},
      {"gato:components/texasState/texas-form-edit",        "gato-area-mail:components/formedit"},
      {"gato:components/texasState/texas-form-file",        "gato-area-mail:components/formfile"},
      {"gato:components/texasState/texas-form-selection",   "gato-area-mail:components/formselection"},
      {"gato:components/texasState/texas-form-submit",      "gato-area-mail:components/formsubmit"},
      {"gato:components/texasState/texas-slideshow",        "gato-template-tsus:components/slideshow"},
      {"gato:components/texasState/texas-slideshow-slide",  "gato-template-tsus:components/slide"},
      {"gato:components/texasState/navBlock",               "gato-template:components/sidenav"},
      {"gato:components/texasState/icon-link",              "gato-template:components/iconlink"},
      {"gato:components/mobile/mobile-audio",               "gato-template-data:components/audio"},
      {"gato:components/mobile/mobile-video",               "gato-template-data:components/video"},
      {"gato:components/tsus/tsus-institution-logo",        "gato-template:components/imagelink"},
      {"gato:components/ua/ua-contentbox",                  "gato-template-ua:components/contentbox"},
      {"gato:components/widgets/accordion",                 "gato-template-ua:components/accordionslide"},
      {"gato:components/widgets/feature/feature",           "gato-component-feature:components/feature"},
      {"gato:components/widgets/feature/feature-slide",     "gato-component-feature:components/slide"},
      {"gato:components/texasState/texas-streaming",        "gato-component-streaming:components/streaming"},

      // page templateIds
      {"gato:pages/tsus-2012/tsus-2012-home",               "gato-template-tsus:pages/home"},
      {"gato:pages/tsus-2012/tsus-2012-mail",               "gato-template-tsus:pages/mail"},
      {"gato:pages/tsus-2012/tsus-2012-standard",           "gato-template-tsus:pages/standard"},
      {"gato:pages/wittliff/wittliff-mail",                 "gato-template-wittliff:pages/mail"},
      {"gato:pages/wittliff/wittliff-main",                 "gato-template-wittliff:pages/standard"},
      {"gato:pages/wittliff/wittliff-sidebar",              "gato-template-wittliff:pages/sidebar"},
      {"gato:pages/ua-2011/ua-2011-main",                   "gato-template-ua:pages/home"},
      {"gato:pages/ua-2011/ua-2011-mail",                   "gato-template-ua:pages/mail"},
      {"gato:pages/ua-2011/ua-2011-standard",               "gato-template-ua:pages/standard"},
      {"gato:pages/ua-2011/ua-2011-news",                   "gato-template-ua:pages/news"},
      {"gato:pages/main-2009/khan-standard",                "gato-template-txstate2009:pages/standard"},
      {"gato:pages/main-2009/khan-mail",                    "gato-template-txstate2009:pages/mail"},
      {"gato:pages/redirect",                               "gato-template:pages/redirect"},
      {"gato:pages/mobile-audio",                           "gato-template-data:pages/audio"},
      {"gato:pages/mobile-video",                           "gato-template-data:pages/video"},
      {"gato:pages/mobile-photos",                          "gato-template-data:pages/photos"},
      {"gato:pages/gato-site-index",                        "gato-template:pages/siteindex"},
      {"gato:pages/library-2012/library-2012-home",         "gato-template-library:pages/home"}
    };

    for (String[] namePair : templateNamePairs) {
      tasks.add(new FindAndChangeTemplateIdTask(RepositoryConstants.WEBSITE, namePair[0], namePair[1]));
    }

    // install global-data nodes if they don't exist
    tasks.add(new NodeExistsDelegateTask("Global Data", "Create global-data node if it does not exist yet.", RepositoryConstants.WEBSITE, "/global-data", null,
        new CreateNodeTask("","",RepositoryConstants.WEBSITE,"/","global-data",NodeTypes.Component.NAME)
    ));
    tasks.add(new NodeExistsDelegateTask("Global Data webTools", "Create global-data footerLinks node if it does not exist yet.", RepositoryConstants.WEBSITE, "/global-data/webTools", null,
      new CreateNodeTask("","",RepositoryConstants.WEBSITE,"/global-data","webTools",NodeTypes.Area.NAME)
    ));

    tasks.add(new CreateNodeTask("Homepage Data","Node to contain data for the various homepage content apps",RepositoryConstants.WEBSITE,"/","homepage-data",NodeTypes.Folder.NAME));
    tasks.add(new CreateNodeTask("Homepage Data Legal Links","",RepositoryConstants.WEBSITE,"/homepage-data","legal-links",NodeTypes.Content.NAME));
    tasks.add(new NodeExistsDelegateTask("Copy Quick Links from main2012", "", RepositoryConstants.WEBSITE, "/main2012/helpfulLinks",
      new MoveNodeTask("","",RepositoryConstants.WEBSITE,"/main2012/helpfulLinks","/homepage-data/legal-links/quick-links",true),
      new CreateNodeTask("", "", RepositoryConstants.WEBSITE,"/homepage-data/legal-links","quick-links",NodeTypes.Content.NAME)
    ));
    tasks.add(new NodeExistsDelegateTask("Copy Required Links from main2012", "", RepositoryConstants.WEBSITE, "/main2012/requiredLinks",
      new MoveNodeTask("","",RepositoryConstants.WEBSITE,"/main2012/requiredLinks","/homepage-data/legal-links/required-links",true),
      new CreateNodeTask("", "", RepositoryConstants.WEBSITE,"/homepage-data/legal-links","required-links",NodeTypes.Content.NAME)
    ));
    tasks.add(new ChangeNodeTypeTask("/homepage-data/legal-links/quick-links",RepositoryConstants.WEBSITE,NodeTypes.Content.NAME));
    tasks.add(new ChangeNodeTypeTask("/homepage-data/legal-links/required-links",RepositoryConstants.WEBSITE,NodeTypes.Content.NAME));

    // when we bootstrapped the official-texas-state-images dam sites, the parent
    // nodes were created as mgnl:content instead of mgnl:folder
    tasks.add(new ChangeNodeTypeTask("/banner-images",DamConstants.WORKSPACE,NodeTypes.Folder.NAME));
    tasks.add(new ChangeNodeTypeTask("/banner-images/official-texas-state-images",DamConstants.WORKSPACE,NodeTypes.Folder.NAME));
    tasks.add(new ChangeNodeTypeTask("/official-texas-state-images",DamConstants.WORKSPACE,NodeTypes.Folder.NAME));

    // change various config properties
    tasks.add(new SetPropertyTask(RepositoryConstants.CONFIG, "/server/filters/activation", "class", "info.magnolia.module.activation.ReceiveFilter"));

    // move tweetStreamer config into the twitter module
    tasks.add(new NodeExistsDelegateTask("Move Twitter config if exists", "/modules/gato/config",
      new MoveNodeTask("Move Twitter config", "/modules/gato/config", "/modules/gato-component-twitter/config", true)));

    // remove a deprecated servlet filter that was disrupting loading of resources
    tasks.add(new RemoveNodeTask("Remove ClasspathSpool filter", "/server/filters/servlets/ClasspathSpoolServlet"));
    // remove the config node for our defunct gato module
    tasks.add(new RemoveNodeTask("Remove old Gato module config", "/modules/gato"));
    // remove the config node for the old 4.5 migration module
    tasks.add(new RemoveNodeTask("Remove old 4.5 migration config", "/modules/magnolia-4-5-migration"));
    // remove the config node for the old 4.5 cas filter
    tasks.add(new RemoveNodeTask("Remove old 4.5 cas filter", "/server/filters/casRedirect"));

    // tasks for every update
    tasks.addAll(installOrUpdateTasks());
    return tasks;
  }

}
