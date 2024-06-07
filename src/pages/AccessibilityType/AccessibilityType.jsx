import { Check, ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Sheet } from "@tamagui/sheet";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Adapt,
  Button,
  ButtonFrame,
  Dialog,
  Image,
  ScrollView,
  Select,
  Text,
  View,
  XStack,
  YStack,
  getFontSize,
} from "tamagui";

import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { COLORS } from "../../constants/colors";
import { setColorBlindness } from "../../redux/reducers/userReducer";

// import { LinearGradient } from "@tamagui/linear-gradient";

function AccessibilityType({ navigation }) {
  return (
    <XStack flexDirection="column" justifyContent="space-between" f={1}>
      <View className="mt-2">
        <ProgressBar value={3 / 5} />
      </View>
      <XStack
        className="p-4"
        flexDirection="column"
        justifyContent="space-between"
        f={1}
      >
        <YStack justifyContent="center" marginTop="8%">
          <Text
            alignSelf="center"
            style={{
              fontSize: 35,
              color: COLORS.primary,
              fontFamily: "Inter-Bold",
            }}
          >
            Accessibility
          </Text>
          {/* <ButtonFrame
            backgroundColor="transparent"
            space
            size="$4.5"
            width="$4.5"
            borderRadius="$12"
            alignSelf="flex-start"
            marginTop="5%"
          >
            <Image
              style={{ width: 45, height: 45, resizeMode: "center" }}
              source={require("../../components/Icons/back.png")}
            />
          </ButtonFrame> */}
        </YStack>

        <YStack ai="center" marginBottom="">
          <Text style={{ fontSize: 16 }} fontFamily="Inter-Regular">
            Choose Your Colour Blindness Type
          </Text>
          <XStack ai="center" style={{ marginTop: 32 }}>
            <SelectDemoItem f={1} fb={0} />
          </XStack>
        </YStack>

        <YStack>
          <XStack justifyContent="space-between">
            <DialogInstance />
            <Button
              backgroundColor={COLORS.black}
              space
              size="$4.5"
              onPress={() => {
                navigation.navigate("FamilyScreen");
              }}
            >
              <Button.Text style={{ color: COLORS.white }}>Next</Button.Text>
              <Button.Icon>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: "center",
                  }}
                  source={require("../../components/Icons/next.png")}
                />
              </Button.Icon>
            </Button>
          </XStack>
        </YStack>
      </XStack>
    </XStack>
  );
}

export function SelectDemoItem(props) {
  const [val, setVal] = useState("dichromacy");
  const dispatch = useDispatch();

  const handleValueChange = (val) => {
    setVal(val);
    dispatch(setColorBlindness(val.toUpperCase()));
  };

  useEffect(() => {
    dispatch(setColorBlindness("dichromacy".toUpperCase()));
  }, []);

  return (
    <Select
      id="accessibility-type"
      value={val}
      onValueChange={handleValueChange}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger width={220} iconAfter={ChevronDown}>
        <Select.Value placeholder="Choose" />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          modal
          snapPointsMode="fit"
          dismissOnSnapToBottom
          animationConfig={{
            type: "timing",
            damping: 40,
            duration: 400,
            mass: 2,
            stiffness: 150,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$10"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          {/* <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          /> */}
        </Select.ScrollUpButton>

        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
          style={{ backgroundColor: COLORS.primary }} // Add this line to set the background color
        >
          <Select.Group>
            <Select.Label>Colour Blindness</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {useMemo(
              () =>
                items.map((item, i) => {
                  return (
                    <Select.Item
                      debug="verbose"
                      index={i}
                      key={item.name}
                      value={item.name.toLowerCase()}
                    >
                      <Select.ItemText>{item.name}</Select.ItemText>
                      <Select.ItemIndicator marginLeft="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                }),
              [items],
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width="$2"
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize(props.size ?? "$true")} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          {/* <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          /> */}
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}

const items = [
  { name: "Dichromacy" },
  { name: "Protanomaly" },
  { name: "Protanopia" },
  { name: "Tritanomaly" },
  { name: "Tritanopia" },
];

function DialogInstance() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      modal
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <Dialog.Trigger asChild>
        <ButtonFrame
          backgroundColor={COLORS.primary}
          space
          size="$5"
          width="$5"
          borderRadius="$12"
          style={{ alignSelf: "flex-start" }}
        >
          <Image
            style={{ width: 50, height: 50, resizeMode: "center" }}
            source={require("../../components/Icons/question-mark.png")}
          />
        </ButtonFrame>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal disableDrag>
          <Sheet.Frame padding="$5" gap="$5">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <XStack>
            <Dialog.Close asChild>
              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Protanopia
              </Dialog.Description>
            </Dialog.Close>
          </XStack>
          <ScrollView>
            <YStack gap="$4">
              <Dialog.Title fontFamily="Inter-Bold">
                Colour Blindness Types
              </Dialog.Title>
              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Dichromacy
              </Dialog.Description>
              <Dialog.Description>
                It is the state of having two types of functioning
                photoreceptors, called cone cells, in the eyes. Organisms with
                dichromacy are called dichromats. Dichromats require only two
                primary colors to be able to represent their visible gamut.{" "}
              </Dialog.Description>

              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Protanomaly
              </Dialog.Description>
              <Dialog.Description>
                It is referred to as “red-weakness”, an apt description of this
                form of color deficiency. Any redness seen in a color by a
                normal observer is seen more weakly by the protanomalous viewer,
                both in terms of its “coloring power” (saturation, or depth of
                color) and its brightness. Red, orange, yellow, and yellow-green
                appear somewhat shifted in hue (“hue” is just another word for
                “color”) towards green, and all appear paler than they do to the
                normal observer.
              </Dialog.Description>

              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Protanopia
              </Dialog.Description>
              <Dialog.Description>
                The brightness of red, orange, and yellow is much reduced
                compared to normal. This dimming can be so pronounced that reds
                may be confused with black or dark gray, and red traffic lights
                may appear to be extinguished. They may learn to distinguish
                reds from yellows and from greens primarily on the basis of
                their apparent brightness or lightness, not on any perceptible
                hue difference. Violet, lavender, and purple are
                indistinguishable from various shades of blue because their
                reddish components are so dimmed as to be invisible. E.g. Pink
                flowers, reflecting both red light and blue light, may appear
                just blue to the protanope.
              </Dialog.Description>

              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Tritanomaly
              </Dialog.Description>
              <Dialog.Description>
                People affected by tritanopia are dichromats. This means the
                S-cones are completely missing and only long- and
                medium-wavelength cones are present. Different studies diverge a
                lot in the numbers but as a rule of thumb you could say one out
                of 10’000 persons is affected at most. In contrary to red-green
                color blindness tritan defects are autosomal and encoded on
                chromosome 7. This means tritanopia and tritanomaly are not
                sex-linked traits and therefore women and men are equally
                affected.
              </Dialog.Description>

              <Dialog.Description style={{ fontWeight: "bold", fontSize: 20 }}>
                Tritanopia
              </Dialog.Description>
              <Dialog.Description>
                It is a rare form of “blue–yellow” color blindness. Despite the
                description, tritanopia does not make it difficult to tell the
                difference between blue and yellow but colors that contain blue
                or yellow. Difficulties lie between green–blue, yellow–pink and
                purple–red.
              </Dialog.Description>
            </YStack>
          </ScrollView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default AccessibilityType;
