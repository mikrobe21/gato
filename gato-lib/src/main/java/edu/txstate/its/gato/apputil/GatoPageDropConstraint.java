package edu.txstate.its.gato.apputil; 

import info.magnolia.pages.app.dnd.TemplateTypeRestrictionDropConstraint;
import info.magnolia.rendering.template.assignment.TemplateDefinitionAssignment;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vaadin.v7.data.Item;

// Don't allow a top level page to be moved under another page.
// Dont allow a sub page to become a top level page.
// Don't allow a sub page to be moved under a different top level page.
public class GatoPageDropConstraint extends TemplateTypeRestrictionDropConstraint {
  private static Logger log = LoggerFactory.getLogger(GatoPageDropConstraint.class);

  @Inject
  public GatoPageDropConstraint(TemplateDefinitionAssignment templateAssignment) {
    super(templateAssignment);
  }

  // Don't allow a top level page to be moved as a child of any node except root.
  // Don't allow a sub page to be moved to root.
  // Don't allow a sub page to be moved under a different top level page.
  @Override
  public boolean allowedAsChild(Item sourceItem, Item targetItem) {
    logm("allowedAsChild", sourceItem, targetItem);
    if (isTopLevel(sourceItem) && !isRoot(targetItem)) {
      log.debug("allowedAsChild returning false. s={}. t={}", isTopLevel(sourceItem), isRoot(targetItem));
      return false;
    }
    if (!isTopLevel(sourceItem) && isRoot(targetItem)) {
      log.debug("allowedAsChild returning false. s={}. t={}", isTopLevel(sourceItem), isRoot(targetItem));
      return false;
    }
    if (!isTopLevel(sourceItem)) {
      return sameTopLevel(sourceItem, targetItem);
    }
    return super.allowedAsChild(sourceItem, targetItem);
  }

  @Override
  public boolean allowedBefore(Item sourceItem, Item targetItem) {
    logm("allowedBefore", sourceItem, targetItem);
    return allowedAsSibling(sourceItem, targetItem) && super.allowedBefore(sourceItem, targetItem);
  }

  @Override
  public boolean allowedAfter(Item sourceItem, Item targetItem) {
    logm("allowedAfter", sourceItem, targetItem);
    return allowedAsSibling(sourceItem, targetItem) && super.allowedAfter(sourceItem, targetItem);
  }

  // Don't allow a top level node to be moved as a sibling of a non-top level node
  // Don't allow a sub page to be moved under a different top level page.
  private boolean allowedAsSibling(Item sourceItem, Item targetItem) {
    if (isTopLevel(sourceItem) && !isTopLevel(targetItem)) {
      log.debug("allowedAsSibling returning false. s={}. t={}", isTopLevel(sourceItem), isTopLevel(targetItem));
      return false;
    }
    if (!isTopLevel(sourceItem)) {
      return sameTopLevel(sourceItem, targetItem);
    }
    return true;
  }

  private void logm(String method, Item sourceItem, Item targetItem) {
    try {
      log.debug("{}. s={}. t={}", method, ((JcrNodeAdapter) sourceItem).getNodeName(), ((JcrNodeAdapter) targetItem).getNodeName());
    } catch (Exception ex) {
      log.error("Error in logm({})", ex, method);
    }
  }

  private boolean isRoot(Item item) {
    try {
      return "/".equals(((JcrNodeAdapter) item).getJcrItem().getPath());
    } catch (Exception ex) {
      log.warn("Error in isRoot", ex);
    }
    return false;
  }

  private boolean isTopLevel(Item item) {
    try {
      return "/".equals(((JcrNodeAdapter) item).getJcrItem().getParent().getPath());
    } catch (RepositoryException e) {
      // Pages are stored at least on the first level, so all of them should have a parent
      log.warn("Failed to resolve item [{}] parent", ((JcrNodeAdapter) item).getNodeName(), e);
    } catch (Exception ex) {
      log.warn("Error in isTopLevel", ex);
    }
    return false;
  }

  private boolean sameTopLevel(Item sourceItem, Item targetItem) {
    try {
      return getTopLevel(sourceItem).isSame(getTopLevel(targetItem));
    } catch (Exception ex) {
      log.warn("Error in sameTopLevel", ex);
    }
    return false;
  }

  private Node getTopLevel(Item item) {
    try {
      return (Node)(((JcrNodeAdapter) item).getJcrItem().getAncestor(1));
    } catch (Exception ex) {
      log.warn("Error in getTopLevel", ex);
    }
    return null;
  }

}
