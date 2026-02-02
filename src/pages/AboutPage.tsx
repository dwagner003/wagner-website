export const AboutPage = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <img
          className="rounded-full w-48 h-48 mx-auto mb-4 object-cover shadow-lg"
          src="/assets/ProfilePic.jpg"
          alt="Devin Wagner"
        />
      </div>

      <p className="text-lg text-gray-700 mb-8">
        Entering college I hadn't thought much about computer science or software engineering. The first semester I
        stumbled into an Intro to Computer Science course and stuck with it. Years later with two college degrees,
        lots of experiences, and many helpful people I am grateful to be enjoying a career in software.
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
            2020
          </h3>
          <p className="text-gray-700">
            Being done with my master's degree was a weight off my shoulders. In my free time, I started reading a mix of
            technical books to develop new skills along with some more relaxing books. Quarantine of 2020 arrived which eliminated the ability
            to referee. I picked up running seriously for the first time, built a desktop PC, and started to build this website.
            Work continues to go well, and I am just starting to work with micro-services in AWS.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
            2019
          </h3>
          <p className="text-gray-700">
            I continued with my master's and decided on an emphasis in web development. Refereeing was still an active part of
            my life but multiple injuries slowed that down quite a bit. Professionally work was going great. Every day I was
            learning something new and was challenged to learn new skills with C#, SQL, AngularJS, and CoffeeScript. In
            December, I finished my master's in software engineering.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-primary border-b-2 border-primary pb-2 mb-4 inline-block">
            2018
          </h3>
          <p className="text-gray-700">
            Four years of college came to an end. Along the way were experiences working with athletics, a role on the community
            involvement committee within student government, participation in the leadership program, and a week long service
            learning opportunity in Nicaragua. I graduated from Regis University with my bachelor's in computer science in May and was
            lucky enough to have a full stack software engineering position lined up in Denver. Outside of school I spent my free time refereeing soccer matches
            of all levels (youth, adult, professional). August of this year I started pursuing my master's in software engineering
            at Regis while continuing to work full time.
          </p>
        </section>
      </div>
    </div>
  );
};
