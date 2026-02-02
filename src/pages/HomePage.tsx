export const HomePage = () => {
  return (
    <div className="text-center">
      <img
        className="rounded-full w-48 h-48 mx-auto mb-6 object-cover shadow-lg"
        src="/assets/ProfilePic.jpg"
        alt="Devin Wagner"
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Hi, I'm Devin.
      </h1>

      <div className="space-y-6 text-lg text-gray-700 max-w-2xl mx-auto">
        <p>
          <strong className="text-primary">As a software engineer</strong> I am interested in creating
          solutions that are scalable, perform well, and are cost effective.
        </p>
        <p>
          <strong className="text-primary">As an individual</strong> I require my work to be meaningful
          not only for myself but for the greater good.
        </p>
        <p>
          <strong className="text-primary">Constant learning</strong> and solving new problems is the
          key to my growth.
        </p>
      </div>
    </div>
  );
};
