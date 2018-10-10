import React from "react";
import ReactDOM from "react-dom";
import { TopicTemplateView } from "../../vendor/rucola-core-lib";

class View extends React.Component {
  /**
   * Render the list items.
   */
  render() {
    return (
      <TopicTemplateView
        id="id1"
        initialValues={{}}
        mode="NEW"
        onSave={() => {}}
        onDelete={() => {}}
        onCrate={() => {}}
      />
    );
  }
}

/**
 * Render the virtual React DOM into an <div> in the current page.
 */
document.addEventListener("DOMContentLoaded", function(event) {
  const reactRoot = document.getElementById("react-root");

  ReactDOM.render(<View />, reactRoot);
});