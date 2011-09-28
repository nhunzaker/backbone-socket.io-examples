// Manage drag and drop for files
// We'll create some new fancy selectors because jQuery lacks them.
function S(expr) { return document.querySelector(expr); }
function SS(expr) { return document.querySelectorAll(expr); } 

function addDropSupport(collection) {
    
    console.log("Added support!");
    
    function dragItem(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    
    function dropItem(e) {
        e.stopPropagation();
        e.preventDefault();
                    
        var droppedItems = e.dataTransfer.files;
        
        if (window.FileReader) {
            
            var reader = new FileReader(),
                text = "";
            
            for (var i = 0, f; f = droppedItems[i]; i++) {
                
                // Let's avoid images for now
                if ( !(f.type.match(/(.png|.jpeg|.jpg|.gif)/gi) ) ) {
                    
                    var type     = f.type.replace("/", "_"),
                        filename = f.name;
                    
                    // Once we've loaded the content, spit it out as a snippet
                    reader.onload = function (e) {
                        
                        console.log("sending file....");
                        
                        var file = new File({
                            content_type : type,
                            content      : e.target.result,
                            owner        : now.core.clientId,
                            filename     : filename,
                            position     : {
                                top: '20%',
                                left: '30%'
                            }
                        });
                        
                        file.set({ 'id' : file.cid });
                        
                        now.addFiletoServer(file.toJSON());
                        
                    };
                
                    reader.readAsText(f, "UTF-8");
                } else {
                    now.flash("notice", "Sorry, we don't support the " + f.type + " format yet!")
                }
            }
                                            
        } else {
            now.flash("error", "<strong>Patchwork:</strong><br/>I'm sorry, file reading doesn't appear to be supported by your browser");
        }
    }
    
    S('body').addEventListener('dragover', dragItem, false)
    S('body').addEventListener('drop', dropItem, false)
}