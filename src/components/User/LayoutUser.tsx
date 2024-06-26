import UserDialog from './DialogUser';

//children: the content that will be rendered within the layout (in router we have <Layout><Overview/></Layout>)
interface LayoutProps {
    children: React.ReactNode; //allows any valid JSX content to be passed as children.
}
const LayoutU = ({children}: LayoutProps) => {
    //is better to render first DogDialog because is a common practice when it needs to appear
    //as overlays or modals on top of the main content
    return (
        <>
            <UserDialog />
            {children}
        </>
    );
};

export default LayoutU;
