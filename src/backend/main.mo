import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type PriceEstimate = {
    estimatedPrice : Nat;
    priceSamples : [Nat];
    sampleCount : Nat;
  };

  type ProductRecognitionResponse = {
    probableProducts : [(Text, Nat)]; // (product name, probability percentage)
  };

  let externalPriceSources = [{
    name = "US Pricing API";
    endpoint = "https://dummy-pricing-api.com/us";
  }];

  func calcMedian(values : [Nat]) : Nat {
    let sorted = values.sort();
    let count = sorted.size();
    switch (count) {
      case (0) { Runtime.trap("Cannot calcMedian on empty array") };
      case (1) { sorted[0] };
      case (_) {
        if (count % 2 == 1) {
          sorted[count / 2];
        } else {
          let mid = (count / 2) - 1;
          (sorted[mid] + sorted[mid + 1]) / 2;
        };
      };
    };
  };

  public shared ({ caller }) func getPriceEstimate(productValue : Nat) : async PriceEstimate {
    let priceSamples = Array.repeat(productValue, externalPriceSources.size());
    let estimate = calcMedian(priceSamples);
    {
      estimatedPrice = estimate;
      priceSamples;
      sampleCount = priceSamples.size();
    };
  };

  public shared ({ caller }) func recognizeProducts() : async ProductRecognitionResponse {
    {
      probableProducts = [
        ("diamond ring", 95),
        ("engagement ring", 89),
        ("1ct diamond jewelry", 75),
      ];
    };
  };
};
