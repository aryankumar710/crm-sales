import { LoginRegisterBanner } from "../../components/LoginRegistration/LoginRegisterBanner.component";

export const SetPassword = () => {
  return (
    <>
      <section className="formSection">
        <LoginRegisterBanner />
        <div className="formContainer">
          <form
            method="post"
            className="glassEffect"
            onSubmit={handleSubmit}
          >
            <h1>Set Password</h1>
                        
          </form>
        </div>
      </section>
    </>
  );
};
