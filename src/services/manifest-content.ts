export function getWebviewContent() {
	return `<!DOCTYPE html>
	<html lang="en">
	  <head>
	  	<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
	
		<title>PWA VSCode Extension Manifest Form</title>
	
		<!-- Import the webpage's stylesheet -->
		<link rel="stylesheet" href="/webview.css" />
	
		<!-- Import the webpage's javascript file -->
		<script src="/script.js" defer></script>
		
		<!-- Ionic Import -->
		<script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
	
	  </head>
	  <body>
		<div id="central">
		  <form id="manifest-options">
			<div id="first-six">
	
			  <div class="six">
				<label for="dir">Dir:</label>
				<div class="input-area">
				  <input type="text" name="dir" id="dir"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the dir option in your manifest.</p>
				  </a>
				</div>
			  </div>
			  
			  <div class="six">
				<label for="name">Name:</label>
				<div class="input-area">
				  <input type="text" name="name" id="name"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the name option in your manifest.</p>
				  </a>
				</div>
			  </div>
			  
			  <div class="six">
				<label for="short_name">Short Name:</label>
				<div class="input-area">
				  <input type="text" name="short_name" id="short_name"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the short name option in your manifest.</p>
				  </a>            
				</div>
			  </div>
			  
			  <div class="six">
				<label for="scope">Scope:</label>
				<div class="input-area">
				  <input type="text" name="scope" id="scope"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the scope option in your manifest.</p>
				  </a>
				</div>
			  </div>
			  
			  <div class="six">
				<label for="start_url">Start Url:</label>
				<div class="input-area">
				  <input type="text" name="start_url" id="start_url"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the start url option in your manifest.</p>
				  </a>
				</div>
			  </div>
			  
			  <div class="six">
				<label for="lang">Default Language:</label>
				<div class="input-area">
				  <input type="text" name="lang" id="lang"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the language option in your manifest.</p>
				  </a>
				</div>
			  </div>
			</div>
	
			<div id="desc-box">
			  <label for="description">Description:</label>
			  <div class="input-area">
				  <textarea type="text" name="description" id="description" rows="3" cols="60"></textarea>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the description option in your manifest.</p>
				  </a>            
			  </div>
			</div>
	
			<div id="bottom-four">
			  <div class="color">
				<label for="theme_color">Theme Color:</label>
				<div class="input-area">
				  <input type="color" name="theme_color" id="theme_color"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the theme color option in your manifest.</p>
				  </a>              
				</div>
				
			  </div>
	
			  <div class="color">
				<label for="background_color">Background Color:</label>
				<div class="input-area">
				  <input type="color" name="background_color" id="background_color"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the background color option in your manifest.</p>
				  </a>              
				</div>
			  </div>
			  
			  <div id="icon-box">
				<label for="icon">512x512 Icon:</label>
				<div class="input-area">
				  <input type="file" name="icon" id="icon"/>
				  <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir" target="_blank" rel="noopener">
					<ion-icon name="information-circle-outline"></ion-icon>              
					<p class="toolTip">Click for more info on the icon option in your manifest.</p>
				  </a>  
				</div>
			  </div>
			  
			  <button id="submit" type="submit">Submit Manifest Options</button>
			</div>
			
		  </form>
		</div>
	  </body>
	</html>`;
  }