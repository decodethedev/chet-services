import Head from "next/head";

import Banner from "@/components/Landing/Banner";
import Navbar from "@/components/Landing/Navbar";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import SecondaryFeatures from "@/components/Landing/SecondaryFeatures";
import CallToAction from "@/components/Landing/CallToAction";
import Team from "@/components/Landing/Team";
import Footer from "@/components/Landing/Footer";
import Pricings from "@/components/Landing/Pricings";
import ExternalUI from "@/components/Landing/ExternalUI";
import Layout from "@/components/Layout";

import axios from "axios";

// axios.defaults.withCredentials = true;

export default function Home() {
  return (
    <>
      <Head>
        <title>Chet - robust and annonymous haxing</title>
        {/* SEO */}
        <meta
          name="keywords"
          content="dahood, dahood-hack, lock, aimbot, chet.fun, chet, roblox-cheat, roblox hack, roblox"
        ></meta>
        <meta name="robots" content="all" />
        <meta
          property="og:title"
          content="Chet - robust and annonymous Roloxxx haxing"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chet.fun" />

        <meta
          property="og:description"
          content="Enter Chet, the epitome of script utilities.
Crafted with versatility in mind, we guarantee that you'll find what you need - whether you want to give yourself a discreet edge over the competition or bring about the downfall of your opponents in the flashiest way possible."
        />
        <meta
          property="og:image"
          content="https://media.discordapp.net/attachments/1077533123392327740/1080799791056953436/logo-blue.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="theme-color" content="#1F5CA9" />

        <meta property="og:site_name" content="Chet" />
      </Head>
      <Banner />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ExternalUI/>
        <SecondaryFeatures />
        <CallToAction />
        <Team />
        {/* <Reviews /> */}
        <Pricings />
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  );
}
