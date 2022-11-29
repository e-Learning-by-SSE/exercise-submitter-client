import React from "react";
import {Button , Segment, Header, Icon, ButtonProps, Form, Menu} from "semantic-ui-react";
import { SubmitState } from "../../constants/Submit";
import TreeView from "./TreeView";
import { Zip } from "../../util/ZipHelper";
import JSZip from "jszip";
import Stack from "../../stacks/Stack";
import { SubmitStack } from "../../stacks/SubmitStack";
import ErrorPortal from "../../portals/ErrorPortal";



export default class Submit extends React.Component<React.PropsWithChildren<{}>, {submitState: string, error: {header: string, description:string} | null}> {

    private dropfilecode: React.ReactElement<any, string | React.JSXElementConstructor<any>> ;
    private filetreecode: React.ReactElement<any, string | React.JSXElementConstructor<any>> | null = null;

    constructor(props: React.PropsWithChildren<{}>) {
        super(props);
        this.state = {submitState: SubmitState.DROPFILE,
            error: null};
        this.dropfilecode = this.getDropFileCode();
        


    }

    private getDropFileCode(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        return (
        <div onDrop={this.fileChange} onDragOver={this.allowDrop}>
            <Segment placeholder>
                <Header icon>
                <Icon name='file code outline' />
                Drop a Zip File or Files
                </Header>
            </Segment>
        </div>
        );

    }

    private getFileTreeCode(filelist: JSZip.JSZipObject[] | FileList): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        return (
            <div className="file-tree-component">
                <div className="upload-button">
                    {this.getUploadButton()}
                </div>
                <TreeView filelist={filelist}/>
            </div>
        );
    }

    private getUploadButton(): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
        return (
            <div className="upload-button">
                <Menu secondary>
                    <Menu.Item>
                        <Button animated icon color="red">
                            <Button.Content visible><Icon name="refresh"></Icon>Retry</Button.Content>
                            <Button.Content hidden><Icon name="refresh"></Icon></Button.Content>
                        </Button>
                    </Menu.Item>
                    <Menu.Item position="right" >
                        <Button animated icon >
                            <Button.Content visible><Icon name="upload"></Icon>Upload</Button.Content>
                            <Button.Content hidden><Icon name="upload"></Icon></Button.Content>
                        </Button>
                    </Menu.Item>
                </Menu>
            </div>);
        
    }

    
  

    fileChange = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        let filelist = event.dataTransfer.files;
        if(filelist.length == 1 && filelist[0].name.endsWith(".zip")) {
           
            let zip = new Zip(filelist[0]).getFiles();
    
            zip.then((filelist) => {
                this.filetreecode = this.getFileTreeCode(filelist);
                this.setState({submitState: SubmitState.FILETREE});
            });

        } else if(filelist.length > 1 && filelist[0].name.endsWith(".zip")) {
            this.setState({error: {header: "Invalid Files", description: "Dont drop more than one Zip File"}});
        } else {
            this.filetreecode = this.getFileTreeCode(filelist);
            this.setState({submitState: SubmitState.FILETREE});
        }
           

    }

    allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    
    /*upload data button with drag and drop field*/
    render() {
        return (
            <div className="submit">
                {this.state.submitState== SubmitState.DROPFILE ? this.dropfilecode :
                 this.state.submitState== SubmitState.FILETREE ? this.filetreecode : null}

                {this.state.error ? <ErrorPortal error={this.state.error} onReady={() =>{this.setState({submitState: SubmitState.DROPFILE})}}/>: null}
            <Stack stack={SubmitStack} selected={this.state.submitState} />
            </div>
        );
    }


}

