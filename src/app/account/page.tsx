import WhichUser from "./_component/which-user";

export default function AccountPage() {
  // check if user is signedIn, if signed in then send to account profile page, if not redirect to auth page
  return <WhichUser />;
}
