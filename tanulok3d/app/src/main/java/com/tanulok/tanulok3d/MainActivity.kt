package com.tanulok.tanulok3d


import android.content.Intent
import android.net.Uri
import com.tanulok.tanulok3d.ui.theme.Tanulok3dTheme
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import io.github.sceneview.Scene
import io.github.sceneview.animation.Transition.animateRotation
import io.github.sceneview.math.Position
import io.github.sceneview.math.Rotation
import io.github.sceneview.node.ModelNode
import io.github.sceneview.rememberCameraManipulator
import io.github.sceneview.rememberCameraNode
import io.github.sceneview.rememberEngine
import io.github.sceneview.rememberEnvironmentLoader
import io.github.sceneview.rememberModelLoader
import io.github.sceneview.rememberNode
import io.github.sceneview.rememberOnGestureListener
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit.MILLISECONDS

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            Tanulok3dTheme {
                var selectedModel by rememberSaveable { mutableStateOf("models/brain.glb") }

                Scaffold(
                    bottomBar = {
                        MyBottomNavigationBar(
                            onModelSelected = { model ->
                                selectedModel = model
                            }
                        )
                    }
                ) {
                    Box(modifier = Modifier
                        .fillMaxSize()
                        .padding(it)) {
                        val engine = rememberEngine()
                        val modelLoader = rememberModelLoader(engine)
                        val environmentLoader = rememberEnvironmentLoader(engine)

                        val centerNode = rememberNode(engine)

                        val cameraNode = rememberCameraNode(engine) {
                            position = Position(y = -0.5f, z = 2.0f)
                            lookAt(centerNode)
                            centerNode.addChildNode(this)
                        }

                        val cameraTransition = rememberInfiniteTransition(label = "CameraTransition")
                        val cameraRotation by cameraTransition.animateRotation(
                            initialValue = Rotation(y = 0.0f),
                            targetValue = Rotation(y = 360.0f),
                            animationSpec = infiniteRepeatable(
                                animation = tween(durationMillis = 7.seconds.toInt(MILLISECONDS))
                            )
                        )

                        Scene(
                            modifier = Modifier.fillMaxSize(),
                            engine = engine,
                            modelLoader = modelLoader,
                            cameraNode = cameraNode,
                            cameraManipulator = rememberCameraManipulator(
                                orbitHomePosition = cameraNode.worldPosition,
                                targetPosition = centerNode.worldPosition
                            ),
//                            childNodes = listOf(centerNode,
//                                rememberNode {
//                                    ModelNode(
//                                        modelInstance = modelLoader.createModelInstance(
//                                            assetFileLocation = selectedModel
//                                        ),
//                                        scaleToUnits = 0.25f
//                                    )
//                                }),
                            childNodes = listOf(
                                centerNode,
                                ModelNode(
                                    modelInstance = modelLoader.createModelInstance(
                                        assetFileLocation = selectedModel
                                    ),
                                    scaleToUnits = 0.25f
                                )
                            ),
                            environment = environmentLoader.createHDREnvironment(
                                assetFileLocation = "environments/sky_2k.hdr"
                            )!!,
                            onFrame = {
                                centerNode.rotation = cameraRotation
                                cameraNode.lookAt(centerNode)
                            },
                            onGestureListener = rememberOnGestureListener(
                                onDoubleTap = { _, node ->
                                    node?.apply {
                                        scale *= 2.0f
                                    }
                                }
                            )
                        )
                        Image(
                            modifier = Modifier
                                .align(Alignment.BottomEnd),
                            painter = painterResource(id = R.drawable.logo),
                            contentDescription = "Logo"
                        )
                    }
                }
            }
        }
    }
}


data class BottomNavigationBarItem(
    val title: String,
    val route: String = "",
    val selectedIcon: Int,
    val unselectedIcon: Int,
)


@Composable
fun MyBottomNavigationBar(
    onModelSelected: (String) -> Unit
) {

    var selectedTab by rememberSaveable { mutableStateOf("Brain") }

    val items = listOf(
        BottomNavigationBarItem(title = "Brain", route = "models/brain.glb", selectedIcon = R.drawable.brain_filled, unselectedIcon = R.drawable.brain),
        BottomNavigationBarItem(title = "Heart", route = "models/heart.glb", selectedIcon = R.drawable.heart_filled, unselectedIcon = R.drawable.heart),
        BottomNavigationBarItem(title = "Lungs", route = "models/lungs.glb", selectedIcon = R.drawable.lungs_filled, unselectedIcon = R.drawable.lungs),
        BottomNavigationBarItem(title = "Stomach", route = "models/stomach.glb", selectedIcon = R.drawable.stomach_filled, unselectedIcon = R.drawable.stomach),
        BottomNavigationBarItem(title = "Eyes", route = "models/eyes.glb", selectedIcon = R.drawable.eye_filled, unselectedIcon = R.drawable.eye)
    )

    NavigationBar(
        containerColor = MaterialTheme.colorScheme.primary,
//        contentColor = Color.White
    ) {
        items.forEach { item ->
            NavigationBarItem(
                icon = {
                    Image(
                        painter = painterResource(id = if (selectedTab == item.title) item.selectedIcon else item.unselectedIcon),
                        contentDescription = item.title,
                        Modifier.size(24.dp),
                    )
                },
                label = { Text(item.title, color = Color.White) },
                selected = selectedTab == item.title,
                onClick = {
                    selectedTab = item.title
                    onModelSelected(item.route)
                }
            )
        }
    }
}